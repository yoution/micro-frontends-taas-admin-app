import { useEffect, useRef } from "react";

/**
 * A hook that calls effect only if dependencies or effect itself change.
 *
 * @param {function} effect function to be called
 * @param {Array} deps dependencies
 */
export const useUpdateEffect = (effect, deps) => {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) {
      return effect();
    } else {
      isMountedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, ...deps]);
};
