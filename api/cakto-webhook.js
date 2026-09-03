// Recebe o webhook de pagamento aprovado da Cakto e envia o evento "Purchase"
// para a Conversions API do Meta (server-side), evitando perda de conversões
// por bloqueadores de anúncio / ITP no navegador do comprador.
//
// Configuração necessária no Vercel (Project Settings → Environment Variables):
//   META_ACCESS_TOKEN = <token gerado no Gerenciador de Eventos do Meta>
//
// Configuração necessária na Cakto (produto → Webhooks):
//   URL: https://SEU-DOMINIO/api/cakto-webhook
//   Evento: pagamento aprovado / compra aprovada
//
// IMPORTANTE: o payload exato que a Cakto envia pode variar. Este handler
// tenta cobrir os formatos mais comuns (event/type + data.customer/buyer),
// mas confira os logs da function na Vercel após o primeiro teste de compra
// e ajuste os nomes de campo abaixo se necessário.

const crypto = require('node:crypto');

const PIXEL_ID = '2099416627508807';

function sha256(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

function isApprovedEvent(body) {
  const eventType = String(body.event || body.type || body.status || '').toLowerCase();
  const dataStatus = String(body.data?.status || '').toLowerCase();
  const approvedPattern = /approved|paid|completed|aprovad|pago|confirmad/;
  return approvedPattern.test(eventType) || approvedPattern.test(dataStatus);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
  if (!ACCESS_TOKEN) {
    console.error('META_ACCESS_TOKEN não configurado nas variáveis de ambiente da Vercel');
    res.status(500).json({ error: 'Server misconfigured: missing META_ACCESS_TOKEN' });
    return;
  }

  const body = req.body || {};

  if (!isApprovedEvent(body)) {
    // Cakto pode reenviar outros eventos (pix gerado, boleto, cancelado etc).
    // Responde 200 para não gerar retentativa, mas não envia nada ao Meta.
    res.status(200).json({ ignored: true });
    return;
  }

  const data = body.data || body;
  const customer = data.customer || data.buyer || {};
  const email = customer.email || data.email;
  const phone = customer.phone || customer.phone_number || data.phone;
  const amount = data.amount ?? data.value ?? data.total ?? data.price ?? 19.9;
  const currency = data.currency || 'BRL';
  const transactionId =
    data.id || data.transaction_id || data.order_id || body.id || `cakto_${Date.now()}`;

  const userData = {};
  const emHash = sha256(email);
  const phHash = sha256(phone);
  if (emHash) userData.em = [emHash];
  if (phHash) userData.ph = [phHash];

  const eventPayload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: String(transactionId),
        action_source: 'website',
        user_data: userData,
        custom_data: {
          currency,
          value: Number(amount),
        },
      },
    ],
  };

  try {
    const metaResp = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
      }
    );
    const result = await metaResp.json();

    if (!metaResp.ok) {
      console.error('Erro ao enviar evento para o Meta CAPI:', result);
      res.status(502).json({ error: 'Meta CAPI error', details: result });
      return;
    }

    res.status(200).json({ ok: true, meta: result });
  } catch (err) {
    console.error('Erro ao chamar o Meta CAPI:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
