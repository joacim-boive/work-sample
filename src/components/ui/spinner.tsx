import { Loader2 } from 'lucide-react';

type SpinnerProps = {
  size?: 'small' | 'large' | 'extra-large';
};

const Icons = {
  spinner: Loader2,
};

const Spinner = ({ size }: SpinnerProps) => {
  let className = 'h-6 w-6 animate-spin inline-block mr-2';

  if (size === 'small') {
    className = 'h-4 w-4 animate-spin inline-block';
  } else if (size === 'large') {
    className = 'h-8 w-8 animate-spin inline-block';
  } else if (size === 'extra-large') {
    className = 'h-12 w-12 animate-spin inline-block';
  }

  return <Icons.spinner className={className} />;
};

export default Spinner;
