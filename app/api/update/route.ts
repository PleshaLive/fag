import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

type RequestBody = {
  caster1: string;
  caster2: string;
};

export async function POST(request: Request) {
  try {
    // Парсим тело запроса
    const body: RequestBody = await request.json();
    const { caster1, caster2 } = body;

    // Валидация входных данных
    if (!caster1 || !caster2) {
      return NextResponse.json({ error: 'Оба поля обязательны' }, { status: 400 });
    }

    // Считываем переменные окружения
    const serviceAccountStr = process.env.GCP_SERVICE_ACCOUNT;
    if (!serviceAccountStr) {
      return NextResponse.json({ error: 'Не задан GCP_SERVICE_ACCOUNT' }, { status: 500 });
    }
    const serviceAccount = JSON.parse(serviceAccountStr);

    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'Не задан SPREADSHEET_ID' }, { status: 500 });
    }

    const sheetName = process.env.SHEET_NAME || 'Sheet1';

    // Авторизация через сервисный аккаунт
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes,
    });
    const authClient = await auth.getClient();

    // Приводим authClient к типу JWT
    const jwtClient = authClient as JWT;

    // Инициализация клиента Google Sheets с приведённым типом
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });

    // Обновляем ячейки: B4 для caster1 и C4 для caster2
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!B4`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[caster1]],
      },
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!C4`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[caster2]],
      },
    });

    return NextResponse.json({ message: 'Данные успешно обновлены!' });
  } catch (error) {
    console.error('Ошибка при обновлении Google Sheets:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
