import { ApiErrorDetail } from "../types/staffx-types";

const staffXDateFormat = (date: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = months[parsedDate.getMonth()];
    const year = parsedDate.getFullYear();

    return `${day}-${month}-${year}`;
}

const base64ToBlobUrl = (base64Data: string, contentType: string): string => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  return URL.createObjectURL(blob);
};

const base64ToUint8Array = (base64Data: string): Uint8Array => {
  const cleaned = base64Data.replace(/^data:application\/pdf;base64,/, "");
  const byteCharacters = atob(cleaned);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Uint8Array(byteNumbers);
};
const openPdfInNewTab = (base64: string, filename = "document.pdf") => {
  // Convert base64 → binary
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob of type PDF
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  // Open in new tab
  const newWindow = window.open(blobUrl, "_blank");

  // Optional: revoke URL when tab is closed
  newWindow?.addEventListener("beforeunload", () => {
    URL.revokeObjectURL(blobUrl);
  });
}

const getDateFromEpoch = (epoch: number, withTime = false): string => {
  if (!epoch) return '';

  const date = new Date(epoch);

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  if (!withTime) {
    return `${yyyy}-${MM}-${dd}`;
  }

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
};

const staffXDateTimeFormat = (epoch: number): string => {
  if (!epoch) return '';

  const date = new Date(epoch);

  const day = String(date.getDate()).padStart(2, '0');

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = monthNames[date.getMonth()];

  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 → 12

  const hh = String(hours).padStart(2, '0');

  return `${day}-${month}-${year} ${hh}:${minutes} ${ampm}`;
};


const extractApiMessage = (detail: ApiErrorDetail) => {
  try {
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail)) {
      if (detail.length > 0) {
        const first = detail[0];
        if (typeof first === "object" && first !== null) {
          if (typeof first.msg === "string") {
            return first.msg;
          }
          if (typeof first.detail === "string") {
            return first.detail;
          }
          if (typeof first.message === "string") {
            return first.message;
          }
        }
      }
      return "";
    }

    if (typeof detail === "object" && detail !== null) {
      if (typeof detail.detail === "string") {
        return detail.detail;
      }
      if (Array.isArray(detail.detail)) {
        if (detail.detail.length > 0 && detail.detail[0]?.msg) {
          return detail.detail[0].msg;
        }
      }
      if (typeof detail.msg === "string") {
        return detail.msg;
      }
      if (typeof detail.message === "string") {
        return detail.message;
      }
    }

    return  'An unknown error occurred';
  } catch {
    return  'An unknown error occurred';
  }
}


export { staffXDateFormat , base64ToBlobUrl, base64ToUint8Array, openPdfInNewTab, getDateFromEpoch, staffXDateTimeFormat, extractApiMessage };