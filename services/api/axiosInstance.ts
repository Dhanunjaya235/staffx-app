import axios, { HttpStatusCode } from 'axios';

const AxiosInstance = axios.create({
  // baseURL: '%%{APIBaseURL}%%',
  baseURL: 'https://db37ae3d417e.ngrok-free.app/api/v1/',
  // baseURL: 'https://chorusdev.cogninelabs.com/api/staffx/',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

AxiosInstance.interceptors.request.use(
  config => {
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkpZaEFjVFBNWl9MWDZEQmxPV1E3SG4wTmVYRSIsImtpZCI6IkpZaEFjVFBNWl9MWDZEQmxPV1E3SG4wTmVYRSJ9.eyJhdWQiOiJhcGk6Ly9iZWZlOGI4Zi05NTZhLTQ3ZjMtYmE1NS03YzYxZTM2ZTkzZWIiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zMDMzNjQyZC02YWRmLTRhYzYtYmJjNS01MTFiNDJiYzVmMDAvIiwiaWF0IjoxNzU3Mzk5MDE5LCJuYmYiOjE3NTczOTkwMTksImV4cCI6MTc1NzQwMzAyNywiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhaQUFBQTFZaDh1dFYrTVRFT0YyTzFiZVgzeXJwbDJ4WFZTTkhsd1pUY3EyeURiSzhuV3JNL3pCZ0xseTZZWG9TbzcrWFVkZzE1em5mOU9way9yWGZBWVFLYjJnPT0iLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiYmVmZThiOGYtOTU2YS00N2YzLWJhNTUtN2M2MWUzNmU5M2ViIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJBbmRhdmFyYXB1IiwiZ2l2ZW5fbmFtZSI6IkRoYW51bmpheWEiLCJpcGFkZHIiOiIxMTUuMjQ2LjE5Ny40MyIsIm5hbWUiOiJEaGFudW5qYXlhIEFuZGF2YXJhcHUiLCJvaWQiOiI3OTI3YTQ3YS02Y2M4LTRhNjItOTMwZS1mNTlmZjNjYWM4MDQiLCJyaCI6IjEuQVZZQUxXUXpNTjlxeGtxN3hWRWJRcnhmQUktTF9yNXFsZk5IdWxWOFllTnVrLXVmQUR4V0FBLiIsInNjcCI6ImFwcCIsInNpZCI6IjAwNDA5MzU5LWFjZjgtYjdkNi05YjQ5LTViYzdiZjI5NTY2NiIsInN1YiI6IjVRcDhPcEctTWVDT3JGQU5vRk1XS2plWDdkUU5UMjl3YmROZEl0bHJZMFEiLCJ0aWQiOiIzMDMzNjQyZC02YWRmLTRhYzYtYmJjNS01MTFiNDJiYzVmMDAiLCJ1bmlxdWVfbmFtZSI6ImRoYW51bmpheWEuYW5kYXZhcmFwdUBjb2duaW5lLmNvbSIsInVwbiI6ImRoYW51bmpheWEuYW5kYXZhcmFwdUBjb2duaW5lLmNvbSIsInV0aSI6Ilg0VzlwNVFQVTB5ZjVONkdpaDVtQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfZnRkIjoic3QxdFJwdjA1ZG51XzRyamdnMmdmZkZpSmpXenMzb3FqYXpCUlc2eWt6QUJhMjl5WldGemIzVjBhQzFrYzIxeiJ9.bSxGbmUipJoCZnuxgf5xaErvvELHwFSlN3ifSjDlM-CVNT7DUSFtzi8dPwDhoShipSiUfXXNQ_zh0plu8gJicoKAdOa57j-8f6KWOjKz5rKaOuwmuSCpTitfGzL6b8k2IvZtQuyT_wqb56wNebBA2Bg-1c4U5I5FEOHavsHNv_xqWcKINUrT1BMKwzgp9x8npIR4USKAfNfrlgjIe1IPBvc37mk7seMlyV0OuFjkLeU56GFzIXyX7QYSK8DVY0KmjVha6QN2fM8ru_rimCgVBgDTyrdEDrZhPw3xoEHTo93G--ia97u1L5aOgMhggUwihV0rRqDiQ9mO38KpK8XeHA`;
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
      if (window.top) {
            window.top.location.reload();
        } else if (window.parent) {
            window.parent.location.reload();
        } else {
            window.location.reload();
        }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;

