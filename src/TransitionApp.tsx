import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

export interface IAppProps {
  children: React.ReactNode;
  isOpen: boolean;
  timeout?: number;
  className?: string[];
}

export default function TransitionApp(props: IAppProps) {
  return (
    <CSSTransition
      in={props.isOpen}
      timeout={props.timeout ?? 300}
      classNames={
        props.className ? props.className.join().replace(',', ' ') : ''
      }
      unmountOnExit
    >
      {props.children}
    </CSSTransition>
  );
}
