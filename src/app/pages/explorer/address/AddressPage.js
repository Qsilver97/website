import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useSocket } from 'src/app/context/SocketContext';
import { formatString } from 'src/app/utils/function';
import LinearProgress from '../../components/common/LinearProgress';
import CardItem from '../../components/CardItem/CardItem';
import AddressText from '../../components/common/AddressText';
import TickText from '../../components/common/TickText';
import AddressTableRow from '../../components/AddressTableRow';
import EmptyBox from '../../components/EmptyBox';
import Pagination from '../tick/Pagination';

const COUNTPERPAGE = 10;

function AddressPage() {
  const { address: addressParam } = useParams();
  const { address, history, loading, sendMessage } = useSocket();
  const [addressData, setAddressData] = useState({});
  const [displayAddressHistory, setDisplayAddressHistory] = useState([]);
  const [hoverIdx, setHoverIdx] = useState();
  const [pageNum, setPageNum] = useState(1);
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleChangePageNum = (page) => {
    setPageNum(page);
  };

  useEffect(() => {
    if (addressParam) {
      sendMessage(addressParam);
      sendMessage(`history ${addressParam}`);
    }
  }, [addressParam]);

  useEffect(() => {
    if (addressParam === address?.address) {
      setAddressData(address);
    }
  }, [addressParam, address]);

  useEffect(() => {
    if (history && typeof history.history === 'object') {
      const indexOfLastItem = pageNum * COUNTPERPAGE;
      const indexOfFirstItem = indexOfLastItem - COUNTPERPAGE;
      setDisplayAddressHistory(history.history.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [history, pageNum]);

  if (loading) {
    return <LinearProgress />;
  }
  return (
    <Box className="container p-8 md:p-40 flex flex-col gap-20 overflow-y-auto">
      <CardItem className="flex w-full flex-col p-4 md:p-12 gap-5 md:gap-16  justify-start">
        <div>
          <div className="flex justify-between items-center">
            <Typography className="text-hawkes-100 text-24 font-urb text-bold text-start">
              Address Detail
            </Typography>
            <div className="flex gap-10">
              <div className="flex gap-4 items-center">
                <img className="w-14 h-14" src="assets/icons/price_mark_white.svg" alt="icon" />
                <Typography className="text-white text-14 bold font-urb">
                  {addressData?.balance ? `${formatString(addressData?.balance)} QUBIC` : 0}
                </Typography>
              </div>
              {address.tokens &&
                address.tokens.map((item) => {
                  return (
                    <div className="flex gap-4 items-center">
                      <img
                        className="w-14 h-14"
                        src="assets/icons/price_mark_white.svg"
                        alt="icon"
                      />
                      <Typography className="text-white text-14 bold font-urb">
                        {addressData?.balance ? `${item[1]} ${item[0]}` : 0}
                      </Typography>
                    </div>
                  );
                })}
              {addressData?.rank && (
                <div className="flex gap-4 items-center">
                  <img className="w-14 h-14" src="assets/icons/trade.svg" alt="icon" />
                  <Typography className="text-white text-14 bold font-urb">
                    {`${addressData?.rank} Rank`}
                  </Typography>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 justify-start mt-4">
            <img
              className="w-24 md:w-28 h-24 md:h-28"
              src="assets/icons/wallet-icon.svg"
              alt="icon"
            />
            <AddressText
              className="text-18"
              address={addressData?.address || addressParam || ''}
              letter={isMobile ? 10 : null}
            />
          </div>
        </div>
        <div className="flex px-6 md:px-12 gap-8 md:gap-20 lg:gap-88 justify-center flex-wrap">
          <CardItem className="flex py-8 sm:py-12 px-12 sm:px-16 gap-10 items-center bg-celestial-10 w-full md:w-auto">
            <img className="w-40 h-40" src="assets/icons/arrow_down.svg" alt="icon" />
            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-6 w-[180px] justify-between">
                <Typography className="text-14 text-hawkes-30 font-urb">Incoming</Typography>
                <Typography className="text-16 text-hawkes-100 font-urb">
                  {formatString(addressData?.totalincoming || 0)}
                </Typography>
              </div>
              <div className="flex items-end gap-6 w-[180px] justify-between">
                <Typography className="text-14 text-hawkes-30 font-urb">Number</Typography>
                <Typography className="text-16 text-hawkes-100 font-urb">
                  {addressData?.numin}
                </Typography>
              </div>
              <div className="flex items-end gap-6 w-[180px] justify-between">
                <Typography className="text-14 text-hawkes-30 font-urb">Latest</Typography>
                {addressData?.latestin ? (
                  <TickText
                    className="text-16 text-hawkes-100 font-urb"
                    tick={addressData?.latestin || 0}
                    copy
                    link
                  />
                ) : null}
              </div>
            </div>
          </CardItem>
          <CardItem className="flex py-8 sm:py-12 px-12 sm:px-16 gap-10 items-center bg-celestial-10 w-full md:w-auto">
            <img className="w-40 h-40 rotate-180" src="assets/icons/arrow_down.svg" alt="icon" />
            <div className="flex flex-col gap-4 w-auto">
              <div className="flex items-end gap-6 w-[180px] justify-between">
                <Typography className="text-14 text-hawkes-30 font-urb">Outgoing</Typography>
                <Typography className="text-16 text-hawkes-100 font-urb">
                  {formatString(addressData?.totaloutgoing || 0)}
                </Typography>
              </div>
              <div className="flex items-end gap-6 w-[180px] justify-between">
                <Typography className="text-14 text-hawkes-30 font-urb">Number</Typography>
                <Typography className="text-16 text-hawkes-100 font-urb">
                  {addressData?.numout}
                </Typography>
              </div>
              <div className="flex items-end gap-6 w-[180px] justify-between">
                <Typography className="text-14 text-hawkes-30 font-urb">Latest</Typography>
                {addressData?.latestout ? (
                  <TickText
                    className="text-16 text-hawkes-100 font-urb"
                    tick={addressData?.latestout || 0}
                    copy
                    link
                  />
                ) : null}
              </div>
            </div>
          </CardItem>
        </div>
        <CardItem className="flex flex-col gap-6 p-4 md:p-16">
          <Typography className="text-24 text-hawkes-100 text-bold font-urb">Activities</Typography>
          <TableContainer
            component={Paper}
            className="rounded-0 bg-transparent text-hawkes-100"
            sx={{ maxHeight: 430 }}
          >
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="bg-celestial-20">
                <TableRow>
                  <TableCell className="border-b-main-80 text-white">TX</TableCell>
                  <TableCell className="border-b-main-80 text-white">Tick</TableCell>
                  <TableCell className="border-b-main-80 text-white">Time</TableCell>
                  <TableCell className="border-b-main-80 text-white">Address</TableCell>
                  <TableCell className="border-b-main-80 text-white">Amount</TableCell>
                  <TableCell className="border-b-main-80 text-white">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayAddressHistory.length > 0 ? (
                  displayAddressHistory.map((row, idx) => (
                    <AddressTableRow
                      row={row}
                      idx={idx}
                      key={idx}
                      hoverIdx={hoverIdx}
                      setHoverIdx={setHoverIdx}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <EmptyBox />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardItem>
        {history.history && (
          <Pagination
            count={Math.ceil(history.history.length / COUNTPERPAGE)}
            handleChangePageNum={handleChangePageNum}
          />
        )}
      </CardItem>
    </Box>
  );
}

export default AddressPage;
