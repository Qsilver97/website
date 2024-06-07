import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSocket } from 'src/app/context/SocketContext';
import { formatString, getTimeAgo } from 'src/app/utils/function';
import AddressText from './common/AddressText';
import TransactionText from './common/TransactionText';
import TickText from './common/TickText';
import TimeText from './common/TimeText';

function AddressTableRow(props) {
  const { socketSync } = useSocket();
  const { row, idx, hoverIdx, setHoverIdx } = props;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [itemLoading, setItemLoading] = useState(false);
  const [sctx, setSctx] = useState();

  const handleMouseEnter = useCallback(
    _.throttle(async (a, item, index) => {
      setHoverIdx(index);
      setItemLoading(true);
      const command = `${item[1]} ${item[0]}`;
      try {
        const resp = await socketSync(command);
        setSctx(JSON.stringify(resp.sctx));
      } catch (error) {
        console.log(error);
      } finally {
        setItemLoading(false);
      }
    }, 100),
    []
  );

  const handleMouseLeave = () => {
    setHoverIdx(undefined);
    setSctx(undefined);
    setItemLoading(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const className = row[4] === 'failed' ? 'text-red-100' : 'text-white';

  return (
    <>
      <TableRow
        sx={{ '& > *': { borderBottom: 'unset' } }}
        className="relative"
        onMouseEnter={(e) => {
          if (row[2].startsWith('BAAAAAAA')) handleMouseEnter(e, row, idx);
        }}
        onMouseLeave={handleMouseLeave}
      >
        <TableCell component="th" scope="row" className="border-b-main-80">
          <TransactionText tx={row[1]} copy letter={12} link />
        </TableCell>
        <TableCell component="th" scope="row" className="border-b-main-80">
          <TickText className="text-white" tick={row[0]} copy link />
        </TableCell>

        <TableCell component="th" scope="row" className="border-b-main-80">
          <TimeText
            className="text-white text-[12px]"
            utcTime={new Date(row[5] * 1000).toUTCString()}
            readableTime={getTimeAgo(currentTime, row[5] * 1000)}
            copy
          />
        </TableCell>

        <TableCell component="th" scope="row" className="border-b-main-80">
          <AddressText address={row[2]} copy letter={12} link />
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          className="border-b-main-80 text-white cursor-pointer"
        >
          <TickText className="text-white" tick={formatString(row[3])} copy />
        </TableCell>

        <TableCell component="th" scope="row" className="border-b-main-80">
          <TickText className={className} tick={row[4] === 'failed' ? 'failed' : 'confirmed'} />
        </TableCell>

        {hoverIdx === idx && sctx && row[2].startsWith('BAAAAAAA') && (
          <TableCell className="absolute bg-white text-black border border-gray-300 shadow-lg p-2 max-w-[300px] bottom-5 left-5 break-words overflow-hidden whitespace-normal z-10">
            {itemLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
            ) : (
              sctx
            )}
          </TableCell>
        )}
      </TableRow>
    </>
  );
}

export default AddressTableRow;
