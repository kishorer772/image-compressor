import * as React from 'react';

export interface IAppProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function FileInput(props: IAppProps) {
  return (
    <input
      type="file"
      accept="image/*"
      data-testid="file-input"
      onChange={(e) => props.onChange && props.onChange(e)}
      disabled={props.disabled ?? false}
    />
  );
}
