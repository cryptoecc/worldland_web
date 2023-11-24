import Select, { SelectProps } from 'components/@common/Select/Select';
import SwapSelectInput from 'components/@common/Select/SwapSelectInput';


const Swap = ({ type, text, listType, input, output, provider, eventHandler }: SelectProps) => {
  return (
    <Select type={type} text={text} listType={listType} provider="Swap">
      <SwapSelectInput type={type} _input={input} _output={output} provider={provider ?? 'Swap'} handleValue={eventHandler} />
    </Select >
  );
};

export default Swap;

