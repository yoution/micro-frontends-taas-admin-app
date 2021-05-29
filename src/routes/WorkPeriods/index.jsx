import React from "react";
import withAuthentication from "hoc/withAuthentication";
import Sidebar from "components/Sidebar";
import Content from "components/Content";
import ContentHeader from "components/ContentHeader";
import ContentBlock from "components/ContentBlock";
import Button from "components/Button";
import Page from "components/Page";
import PageTitle from "components/PageTitle";
import PeriodFilters from "./components/PeriodFilters";
import Periods from "./components/Periods";
import PeriodCount from "./components/PeriodCount";
import PeriodsPagination from "./components/PeriodsPagination";
import styles from "./styles.module.scss";
import PeriodWeekPicker from "./components/PeriodWeekPicker";

const WorkPeriods = () => (
  <Page className={styles.container}>
    <Sidebar>
      <PeriodFilters />
    </Sidebar>
    <Content>
      <ContentHeader className={styles.contentHeader}>
        <PageTitle text="Working Periods" />
        <Button variant="contained" onClick={() => {}}>
          Process Day
        </Button>
      </ContentHeader>
      <ContentBlock>
        <div className={styles.periodsHeader}>
          <PeriodCount className={styles.periodCount} />
          <PeriodWeekPicker className={styles.periodWeekPicker} />
          <PeriodsPagination
            className={styles.periodsPagination}
            id="periods-pagination-top"
          />
        </div>
        <Periods />
        <div className={styles.periodsFooter}>
          <PeriodsPagination
            className={styles.periodPagination}
            id="periods-pagination-bottom"
          />
        </div>
      </ContentBlock>
    </Content>
  </Page>
);

export default withAuthentication(WorkPeriods);
