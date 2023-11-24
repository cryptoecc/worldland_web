import SwapSelect, { SelectProps } from 'components/@common/Select/SwapSelect';
import SwapSelectInput from 'components/@common/Select/SwapSelectInput';


const Swap = ({ type, text, listType, input, output, provider, eventHandler }: SelectProps) => {
  return (
    <SwapSelect type={type} text={text} listType={listType} provider="Swap">
      <SwapSelectInput type={type} _input={input} _output={output} provider={provider ?? 'Swap'} handleValue={eventHandler} />
    </SwapSelect >
  );
};

export default Swap;

