"use client"
import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { userActions } from '@/redux/features'
import { useAppDispatch } from '@/redux/store';
import { useSession } from '@/hooks';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} sx={{
          height: '15px',
          width: '200px',
          backgroundColor: '#103253',
          '& .MuiLinearProgress-bar': {
            backgroundColor: ' #052a72'
          }

        }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="#5a5dc4">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function LinearProgressBar({ onEnd }: { onEnd: () => void }) {
  const dispatch = useAppDispatch();
  const { session: data } = useSession();


  React.useEffect(() => {
    if (data?.user) {
      dispatch(userActions.setCurrentUser(data.user));
    }
  }, [data, dispatch])

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setProgress(5 + Math.random() * 15);
  }, [])

  React.useEffect(() => {

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const diff = 7 + Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);

    if (progress === 100) {
      clearInterval(timer);
      onEnd();
    }

    return () => {
      clearInterval(timer);
    };
  }, [progress, onEnd]);

  return (
    <Box className='absolute flex-1 h-full w-full flex justify-center items-center bg-[#0c1b38] z-[9999]'>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}