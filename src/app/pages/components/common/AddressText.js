import { Typography, Box, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { copyText, formatEllipsis } from 'src/app/utils/function';

const AddressText = (props) => {
  const { address, letter, copy, className, link } = props;
  const [isCopy, setIsCopy] = useState(false);
  useEffect(() => {
    if (isCopy) {
      setTimeout(() => setIsCopy(false), 1000);
    }
  }, [isCopy]);
  const handleCopy = () => {
    copyText(address);
    setIsCopy(true);
  };
  return (
    <Box className="flex gap-5 items-center">
      <Link to={link ? `/explorer/address/${address}` : ''}>
        <Tooltip title={address} arrow>
          <Typography className={`text-hawkes-100 font-space ${className}`}>
            {letter ? formatEllipsis(address, letter) : address}
          </Typography>
        </Tooltip>
      </Link>
      {copy && (
        <button type="button" onClick={handleCopy}>
          {isCopy ? (
            <img className="w-14 mb-4" src="assets/icons/ok_icon_light.svg" alt="" />
          ) : (
            <img className="w-14 mb-4" src="assets/icons/copy_icon.webp" alt="" />
          )}
        </button>
      )}
    </Box>
  );
};

export default AddressText;
