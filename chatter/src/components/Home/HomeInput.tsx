import React, { Dispatch, SetStateAction } from 'react';

type HomeInputProps = {
  placeholder?: string;
  value?: string | number;
  onChange: Dispatch<SetStateAction<string>>;
  type: string;
  required: boolean;
  checked?: boolean;
  name?: string;
  id?: string;
};

const HomeInput = ({
  placeholder,
  value,
  onChange,
  type,
  required,
  checked,
  name,
  id,
}: HomeInputProps) => {
  return (
    <input
      className="home-input"
      name={name}
      id={id}
      checked={checked}
      type={type}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      required={required}
      placeholder={placeholder}
    />
  );
};

export default HomeInput;
