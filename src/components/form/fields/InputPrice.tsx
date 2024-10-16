import React from 'react';
import { TextFieldElement, useController } from 'react-hook-form-mui';
import { InputAdornment } from '@mui/material';
import { AttachMoney } from '@mui/icons-material';
import SvgIcon from '@mui/material/SvgIcon';

interface InputPriceProps {
  name: string;
  disabled?: boolean;
  label?: string;
  allowNegative?: boolean;
}

export const InputPrice: React.FC<InputPriceProps> = ({ name, disabled, label, allowNegative }) => {
  const { field } = useController({ name });
  return (
    <TextFieldElement
      name={name}
      type="number"
      onChange={(event) => field.onChange(+event.target.value)}
      inputProps={{ min: allowNegative ? undefined : 0 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SvgIcon component={AttachMoney} />
          </InputAdornment>
        ),
      }}
      label={label ?? `Precio por sesión`}
      disabled={disabled}
      fullWidth
    />
  );
};
