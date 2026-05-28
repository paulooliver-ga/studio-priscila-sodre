import axios from 'axios';

const EVOLUTION_API_URL = 'https://oliver.sistemaproativo.digital';
const EVOLUTION_API_KEY = '499108D68FCA-495B-B76E-6F3527D6635E';
const EVOLUTION_INSTANCE = 'Salao-promo';

export async function sendPromotionMessage(
  phone: string,
  title: string,
  description: string
) {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `🎉 *${title}*\n\n${description}\n\n✨ Acesse seu cartão!\nhttps://studiopriscilasodre.com.br`;

    console.log('📤 Enviando para:', cleanPhone);
    console.log('📝 Mensagem:', message);
    console.log('🔗 URL:', `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`);

    const response = await axios.post(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        number: cleanPhone,
        text: message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
      }
    );

    console.log('✅ Resposta:', response.status, response.data);
    return response.status === 200 || response.status === 201;
  } catch (err: any) {
    console.error('❌ Erro completo:', err.response?.data || err.message);
    return false;
  }
}

export function isConnectedWA() {
  return !!EVOLUTION_API_KEY;
}