import { memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "@reach/router";
import debounce from "lodash/debounce";
import { WORK_PERIODS_PATH } from "constants/index.js";
import { useUpdateEffect } from "utils/hooks";
import { getWorkPeriodsUrlQuery } from "store/selectors/workPeriods";
import { updateStateFromQuery } from "store/actions/workPeriods";

const PeriodsUrl = () => {
  const query = useSelector(getWorkPeriodsUrlQuery);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const updateUrl = useCallback(
    debounce(
      (query) => {
        navigate(`${WORK_PERIODS_PATH}?${query}`);
      },
      300,
      { leading: false }
    ),
    [navigate]
  );

  useEffect(() => {
    updateUrl(query);
  }, [updateUrl, query]);

  useUpdateEffect(() => {
    dispatch(updateStateFromQuery(location.search));
  }, [dispatch, location.search]);

  return null;
};

export default memo(PeriodsUrl);
