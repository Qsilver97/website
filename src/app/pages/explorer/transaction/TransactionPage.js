import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { formatString, getTimeAgo } from 'src/app/utils/function';
import { useSocket } from 'src/app/context/SocketContext';
import LinearProgress from '../../components/common/LinearProgress';
import CardItem from '../../components/CardItem/CardItem';
import TransactionText from '../../components/common/TransactionText';
import AddressText from '../../components/common/AddressText';

function TransactionPage() {
  const { tx: txParam } = useParams();
  const { tx, loading, sendMessage } = useSocket();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [txData, setTxData] = useState();
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    if (txParam) {
      sendMessage(txParam);
    }
  }, [txParam]);

  useEffect(() => {
    if (Object.keys(tx).length > 0) {
      setTxData(tx);
      console.log(tx);
    }
  }, [tx]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <LinearProgress />;
  }
  return (
    <Box className="container p-8 md:p-40 flex flex-col gap-20">
      <CardItem className="flex w-full flex-col p-4 md:p-12 gap-5 md:gap-16  justify-start">
        <div>
          <Typography className="text-hawkes-100 text-24 font-urb text-bold text-start">
            Transaction Detail
          </Typography>
          <div className="flex items-center gap-6 justify-start mt-4">
            <img
              className="w-24 md:w-28 h-24 md:h-28"
              src="assets/icons/transaction_mark.webp"
              alt="icon"
            />
            <TransactionText tx={txParam} letter={isMobile ? 10 : null} className="text-16" />
          </div>
        </div>
        <div className="flex justify-center">
          <CardItem className="flex flex-col w-full md:w-2/3 py-8 sm:py-12 px-8 sm:px-16 gap-5 md:gap-10 items-center bg-celestial-10">
            <div className="flex justify-between items-center w-full gap-36 py-3 border-b-1">
              <div className="flex w-60 items-center gap-4">
                <img className="w-20 h-20" src="assets/icons/information-icon.svg" alt="icon" />
                <Typography className="text-hawkes-100 text-16 font-urb">Amount</Typography>
              </div>
              <Typography className="text-white text-16 bold font-urb">
                {formatString(txData?.amount || 0)} QUBIC
              </Typography>
            </div>
            <div className="flex justify-between items-center w-full gap-36 py-3 border-b-1">
              <div className="flex w-60 items-center gap-4">
                <img className="w-20 h-20" src="assets/icons/information-icon.svg" alt="icon" />
                <Typography className="text-hawkes-100 text-16 font-urb">Type</Typography>
              </div>
              <Typography className="text-white text-16 bold font-urb">
                {txData?.type} Standard
              </Typography>
            </div>
            <div className="flex justify-between items-center w-full gap-36 py-3 border-b-1">
              <div className="flex w-60 items-center gap-4">
                <img className="w-20 h-20" src="assets/icons/information-icon.svg" alt="icon" />
                <Typography className="text-hawkes-100 text-16 font-urb">From</Typography>
              </div>
              <AddressText
                address={txData?.src}
                className="text-white text-16"
                letter={isMobile ? 5 : null}
                link
                copy={!isEmpty(txData?.src)}
              />
            </div>
            <div className="flex justify-between items-center w-full gap-36 py-3 border-b-1">
              <div className="flex w-60 items-center gap-4">
                <img className="w-20 h-20" src="assets/icons/information-icon.svg" alt="icon" />
                <Typography className="text-hawkes-100 text-16 font-urb">To</Typography>
              </div>
              <AddressText
                address={txData?.dest}
                className="text-white text-16"
                letter={isMobile ? 5 : null}
                link
                copy={!isEmpty(txData?.src)}
              />
            </div>
            <div className="flex justify-between items-center w-full gap-36 py-3 border-b-1">
              <div className="flex w-60 items-center gap-4">
                <img className="w-20 h-20" src="assets/icons/information-icon.svg" alt="icon" />
                <Typography className="text-hawkes-100 text-16 font-urb">Time</Typography>
              </div>
              <div className="flex flex-col items-end gap-10">
                <AddressText
                  address={new Date(txData?.utc * 1000).toUTCString()}
                  className="text-white text-16"
                  copy
                />
                <AddressText
                  address={getTimeAgo(currentTime, txData?.utc * 1000)}
                  className="text-white text-16"
                  copy
                />
                <AddressText address={txData?.utc} className="text-white text-16" copy />
              </div>
            </div>
            <div className="flex justify-between items-center w-full gap-36 py-3 border-b-1">
              <div className="flex w-60 items-center gap-4">
                <img className="w-20 h-20" src="assets/icons/information-icon.svg" alt="icon" />
                <Typography className="text-hawkes-100 text-16 font-urb">Status</Typography>
              </div>
              {txData && txData.status && txData.status === 'confirmed' && (
                <div className="flex gap-10 items-center">
                  <span>Confirmed</span>
                  <CheckIcon className="text-green" />
                </div>
              )}
              {txData && txData.status && txData.status === 'failed' ? (
                <div className="flex gap-10 items-center">
                  <span>Failed</span>
                  <CloseIcon className="text-red" />
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="flex justify-between items-center w-full gap-36 py-3 border-b-1">
              <div className="flex w-full items-center gap-4">
                <img className="w-20 h-20" src="assets/icons/information-icon.svg" alt="icon" />
                <Typography className="text-hawkes-100 text-16 font-urb">SCTX Detail</Typography>
              </div>
              {txData && txData.sctx && (
                <pre style={{ padding: '10px', borderRadius: '5px' }}>
                  {JSON.stringify(txData.sctx, null, 2)}
                </pre>
              )}
            </div>
          </CardItem>
        </div>
      </CardItem>
    </Box>
  );
}

export default TransactionPage;
