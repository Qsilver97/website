// import { useSocket } from "../context/SocketContext";

const formatString = (string) => {
  return string ? Number(string).toLocaleString('en-US') : '0';
};

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
    hour12: true, // Use 12-hour format with AM/PM
  };

  if (dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  return '';
};

function formatEllipsis(str, letter = 4) {
  if (str) {
    if (str.length > 10) {
      return `${str.substr(0, letter)} ... ${str.substr(-letter)}`;
    }
    return str;
  }
  return '';
}

function copyText(textToCopy) {
  const input = document.createElement('input');
  input.value = textToCopy;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

export { formatString, formatDate, formatEllipsis, copyText };