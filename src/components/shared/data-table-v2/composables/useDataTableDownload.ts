import type { AxiosInstance } from 'axios';
import type { DownloadLink, TableItem } from '@/types/componentTypes/DataTableTypes';

function contentTypeIncludesXml(contentType: string | null | undefined): boolean {
  return Boolean(contentType && contentType.includes('xml'));
}

export function useDataTableDownload(axiosInstance: AxiosInstance, notify: (message: string) => void) {
  const triggerBlobDownload = (blob: Blob, fileUrlString: string) => {
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileUrlString.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
    notify('✅ دانلود شروع شد');
  };

  const download = async (key: string | number, item: TableItem, downloadLink: DownloadLink | undefined) => {
    if (!downloadLink || !item) return;

    const fileKey = downloadLink[key];
    const fileUrl = item[fileKey];
    if (!fileUrl || typeof fileUrl !== 'string') {
      notify('❌ لینک فایل یافت نشد.');
      return;
    }

    const fileUrlString = fileUrl;

    try {
      const response = await fetch(fileUrlString, {
        method: 'GET',
        headers: { Accept: 'application/octet-stream,application/pdf,image/*,*/*' },
        credentials: 'include'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const contentType = response.headers.get('content-type');
      if (contentTypeIncludesXml(contentType)) {
        console.error('Server returned XML error:', await response.text());
        notify('❌ خطای سرور: فایل در دسترس نیست');
        return;
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) < 1000) {
        const responseText = await response.text();
        if (responseText.includes('error') || responseText.includes('Error')) {
          notify('❌ خطای سرور: فایل در دسترس نیست');
          return;
        }
      }

      triggerBlobDownload(await response.blob(), fileUrlString);
    } catch (error) {
      console.error('Download error:', error);
      try {
        const axiosResponse = await axiosInstance.get(fileUrlString, {
          responseType: 'blob',
          headers: { Accept: 'application/octet-stream,application/pdf,image/*,*/*' }
        });

        const rawContentType = axiosResponse.headers['content-type'];
        const contentType = typeof rawContentType === 'string' ? rawContentType : undefined;
        if (contentTypeIncludesXml(contentType)) {
          const textResponse = await axiosInstance.get(fileUrlString, { responseType: 'text' });
          console.error('Server returned XML error:', textResponse.data);
          notify('❌ خطای سرور: فایل در دسترس نیست');
          return;
        }

        triggerBlobDownload(new Blob([axiosResponse.data]), fileUrlString);
      } catch (axiosError) {
        console.error('Axios download error:', axiosError);
        notify('❌ خطا در دانلود فایل');
      }
    }
  };

  return { download };
}
