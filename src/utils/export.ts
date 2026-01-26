// 動的インポートを使用（パッケージがインストールされていない場合のエラーハンドリング）
let html2canvas: any = null;
let jsPDF: any = null;

const loadHtml2Canvas = async () => {
  if (!html2canvas) {
    try {
      html2canvas = (await import('html2canvas')).default;
    } catch (error) {
      throw new Error('html2canvasパッケージがインストールされていません。npm install html2canvas を実行してください。');
    }
  }
  return html2canvas;
};

const loadJsPDF = async () => {
  if (!jsPDF) {
    try {
      jsPDF = (await import('jspdf')).jsPDF;
    } catch (error) {
      throw new Error('jspdfパッケージがインストールされていません。npm install jspdf を実行してください。');
    }
  }
  return jsPDF;
};

/**
 * 要素を画像としてエクスポート
 */
export const exportAsImage = async (
  elementId: string,
  filename: string = 'work-insight-result.png'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('エクスポートする要素が見つかりません');
  }

  try {
    const html2canvasLib = await loadHtml2Canvas();
    const canvas = await html2canvasLib(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error: any) {
    console.error('画像エクスポートエラー:', error);
    throw new Error(error.message || '画像のエクスポートに失敗しました');
  }
};

/**
 * 要素をPDFとしてエクスポート
 */
export const exportAsPDF = async (
  elementId: string,
  filename: string = 'work-insight-result.pdf'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('エクスポートする要素が見つかりません');
  }

  try {
    const html2canvasLib = await loadHtml2Canvas();
    const jsPDFLib = await loadJsPDF();

    const canvas = await html2canvasLib(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDFLib({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error: any) {
    console.error('PDFエクスポートエラー:', error);
    throw new Error(error.message || 'PDFのエクスポートに失敗しました');
  }
};
