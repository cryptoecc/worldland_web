import Select, { SelectProps } from 'components/@common/Select/Select';

import SelectInput from 'components/@common/Select/SelectInput';
import { useSwapContext } from 'contexts/SwapProvider';

const Swap = ({ type, text, listType, provider }: SelectProps) => {
  const { input, output } = useSwapContext();
  return (
    <Select type={type} text={text} listType={listType}>
      <SelectInput type={type} provider={provider ?? 'Swap'} />
    </Select>
  );
};

export default Swap;
