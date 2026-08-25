import { useCallback, useRef } from 'react';

export function useTouchControls(actions) {
  const softDropActiveRef = useRef(false);

  const onSoftDropStart = useCallback(() => {
    softDropActiveRef.current = true;
    actions.setSoftDropHeld(true);
  }, [actions]);

  const onSoftDropEnd = useCallback(() => {
    softDropActiveRef.current = false;
    actions.setSoftDropHeld(false);
  }, [actions]);

  return {
    onLeft: actions.moveLeft,
    onRight: actions.moveRight,
    onRotate: actions.rotateCW,
    onHardDrop: actions.hardDrop,
    onHold: actions.hold,
    onSoftDropStart,
    onSoftDropEnd,
  };
}
