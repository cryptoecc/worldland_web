import Select, { SelectProps } from 'components/@common/Select/Select';
import SelectInput from 'components/@common/Select/SelectInput';


const Swap = ({ type, text, listType, input, output, provider, eventHandler }: SelectProps) => {
  return (
    <Select type={type} text={text} listType={listType}>
      <SelectInput type={type} _input={input} _output={output} provider={provider ?? 'Swap'} handleValue={eventHandler} />
    </Select >
  );
};

export default Swap;

