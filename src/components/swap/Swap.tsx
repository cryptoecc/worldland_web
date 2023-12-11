import Select, { SelectProps } from 'components/@common/Select/Select';
import SelectInput from 'components/@common/Select/SelectInput';

const Swap = ({ type, text, listType, input, output, eventHandler, setMax }: SelectProps) => {
  return (
    <Select type={type} text={text} listType={listType}>
      <SelectInput type={type} _input={input} _output={output} handleValue={eventHandler} setMax={setMax} />
    </Select>
  );
};

export default Swap;
