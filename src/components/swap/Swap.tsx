import Select, { SelectProps } from 'components/@common/Select/Select';

import SelectInput from 'components/@common/Select/SelectInput';

const Swap = ({ type, text, listType }: SelectProps) => {
  return (
    <Select type={type} text={text} listType={listType}>
      <SelectInput type={type} />
    </Select>
  );
};

export default Swap;
