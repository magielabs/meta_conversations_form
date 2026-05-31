/**
 * Apps Script para receber inscrições do formulário Magie e gravá-las
 * na planilha do Google Sheets.
 *
 * COMO PUBLICAR:
 * 1. Abra a sua planilha no Google Sheets.
 * 2. Menu: Extensões > Apps Script.
 * 3. Apague o conteúdo padrão e cole este arquivo inteiro.
 * 4. (Opcional) Ajuste SHEET_NAME para o nome da aba onde quer gravar.
 * 5. Clique em "Implantar" > "Nova implantação".
 * 6. Tipo: "App da Web". Executar como: "Eu". Quem pode acessar: "Qualquer pessoa".
 * 7. Copie a URL gerada (termina em /exec) e coloque na env GOOGLE_SHEETS_WEBHOOK_URL.
 */

const SHEET_NAME = "Inscrições";
const HEADERS = ["Data/Hora", "Nome", "Telefone", "Empresa", "Email"];

// Deixe vazio ("") se o script foi criado A PARTIR da planilha (Extensões > Apps Script).
// Se for um script avulso, cole aqui o ID da planilha (parte da URL entre /d/ e /edit).
const SPREADSHEET_ID = "";

function doGet() {
  return ContentService.createTextOutput(
    "Magie — endpoint de inscrições ativo.",
  );
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    sheet.appendRow([
      formatTimestamp_(data.submittedAt),
      data.nome || "",
      data.telefone || "",
      data.empresa || "",
      data.email || "",
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getSheet_() {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function formatTimestamp_(iso) {
  const date = iso ? new Date(iso) : new Date();
  return Utilities.formatDate(
    date,
    "America/Sao_Paulo",
    "dd/MM/yyyy HH:mm:ss",
  );
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
