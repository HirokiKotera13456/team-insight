import { exportAsImage, exportAsPDF } from '../export';

// Mock html2canvas and jsPDF
const mockCanvas = {
  toDataURL: jest.fn(() => 'data:image/png;base64,mockdata'),
  width: 800,
  height: 600,
};

const mockHtml2Canvas = jest.fn().mockResolvedValue(mockCanvas);
const mockJsPDF = jest.fn().mockImplementation(() => ({
  addImage: jest.fn(),
  addPage: jest.fn(),
  save: jest.fn(),
}));

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: mockHtml2Canvas,
}));

jest.mock('jspdf', () => ({
  jsPDF: mockJsPDF,
}));

// Mock DOM methods
const mockLink = {
  click: jest.fn(),
  download: '',
  href: '',
};

const createElementSpy = jest.spyOn(document, 'createElement');
const getElementByIdSpy = jest.spyOn(document, 'getElementById');

describe('export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createElementSpy.mockReturnValue(mockLink as any);
    // Default: return element for 'test-element'
    getElementByIdSpy.mockImplementation((id: string) => {
      if (id === 'non-existent') {
        return null;
      }
      // Return element for 'test-element' and any other id
      return {
        offsetWidth: 800,
        offsetHeight: 600,
      } as any;
    });
  });

  // Note: We don't restore mocks in afterEach to avoid issues with test isolation

  describe('exportAsImage', () => {
    it('should export element as image successfully', async () => {
      await exportAsImage('test-element', 'test-image.png');

      expect(getElementByIdSpy).toHaveBeenCalledWith('test-element');
      expect(mockHtml2Canvas).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        })
      );
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
      expect(mockLink.download).toBe('test-image.png');
      expect(mockLink.href).toBe('data:image/png;base64,mockdata');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should use default filename when not provided', async () => {
      getElementByIdSpy.mockReturnValue({
        offsetWidth: 800,
        offsetHeight: 600,
      } as any);
      
      await exportAsImage('test-element');

      expect(mockLink.download).toBe('work-insight-result.png');
    });

    it('should throw error when element not found', async () => {
      getElementByIdSpy.mockReturnValue(null);

      await expect(exportAsImage('non-existent')).rejects.toThrow(
        'エクスポートする要素が見つかりません'
      );
    });

    it('should handle html2canvas error', async () => {
      getElementByIdSpy.mockReturnValue({
        offsetWidth: 800,
        offsetHeight: 600,
      } as any);
      const error = new Error('Canvas error');
      mockHtml2Canvas.mockRejectedValueOnce(error);

      await expect(exportAsImage('test-element')).rejects.toThrow('Canvas error');
    });
  });

  describe('exportAsPDF', () => {
    it('should export element as PDF successfully', async () => {
      getElementByIdSpy.mockReturnValue({
        offsetWidth: 800,
        offsetHeight: 600,
      } as any);
      const mockPdfInstance = {
        addImage: jest.fn(),
        addPage: jest.fn(),
        save: jest.fn(),
      };
      mockJsPDF.mockReturnValueOnce(mockPdfInstance);

      await exportAsPDF('test-element', 'test-result.pdf');

      expect(getElementByIdSpy).toHaveBeenCalledWith('test-element');
      expect(mockHtml2Canvas).toHaveBeenCalled();
      expect(mockJsPDF).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      expect(mockPdfInstance.addImage).toHaveBeenCalled();
      expect(mockPdfInstance.save).toHaveBeenCalledWith('test-result.pdf');
    });

    it('should use default filename when not provided', async () => {
      getElementByIdSpy.mockReturnValue({
        offsetWidth: 800,
        offsetHeight: 600,
      } as any);
      const mockPdfInstance = {
        addImage: jest.fn(),
        addPage: jest.fn(),
        save: jest.fn(),
      };
      mockJsPDF.mockReturnValueOnce(mockPdfInstance);

      await exportAsPDF('test-element');

      expect(mockPdfInstance.save).toHaveBeenCalledWith('work-insight-result.pdf');
    });

    it('should handle multi-page PDF when content is tall', async () => {
      getElementByIdSpy.mockReturnValue({
        offsetWidth: 800,
        offsetHeight: 600,
      } as any);
      // Mock tall canvas
      const tallCanvas = {
        ...mockCanvas,
        height: 2000, // Tall enough to require multiple pages
      };
      mockHtml2Canvas.mockResolvedValueOnce(tallCanvas);

      const mockPdfInstance = {
        addImage: jest.fn(),
        addPage: jest.fn(),
        save: jest.fn(),
      };
      mockJsPDF.mockReturnValueOnce(mockPdfInstance);

      await exportAsPDF('test-element');

      // Should add multiple pages for tall content
      expect(mockPdfInstance.addImage).toHaveBeenCalled();
    });

    it('should throw error when element not found', async () => {
      getElementByIdSpy.mockReturnValue(null);

      await expect(exportAsPDF('non-existent')).rejects.toThrow(
        'エクスポートする要素が見つかりません'
      );
    });

    it('should handle html2canvas error', async () => {
      getElementByIdSpy.mockReturnValue({
        offsetWidth: 800,
        offsetHeight: 600,
      } as any);
      const error = new Error('Canvas error');
      mockHtml2Canvas.mockRejectedValueOnce(error);

      await expect(exportAsPDF('test-element')).rejects.toThrow('Canvas error');
    });

    it('should handle jsPDF error', async () => {
      getElementByIdSpy.mockReturnValue({
        offsetWidth: 800,
        offsetHeight: 600,
      } as any);
      const error = new Error('PDF error');
      mockJsPDF.mockImplementationOnce(() => {
        throw error;
      });

      await expect(exportAsPDF('test-element')).rejects.toThrow('PDF error');
    });
  });
});
