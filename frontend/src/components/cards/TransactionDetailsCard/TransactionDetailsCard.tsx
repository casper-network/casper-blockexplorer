import React from 'react';
import styled from 'styled-components';
import {
  DetailDataLabel,
  DetailDataList,
  DetailDataValue,
  DetailDataWrapper,
  Grid,
  HideOnDesktop,
  HideOnMobile,
} from '../../styled';
import { breakpoints, fonts, fontWeight, pxToRem } from '../../../styled-theme';
import { HeadContentWrapper, Heading, InfoCard } from '../../base';
import { Coin } from '../../utility';
import { Deploy, DeployStatus } from '../../../api';
import { FailureIcon, SuccessIcon } from '../../icons';

interface TransactionDetailsCardProps {
  deploy: Deploy;
}

export const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({
  deploy,
}) => {
  const {
    paymentAmount,
    cost,
    amount,
    readableTimestamp,
    action,
    status,
    deployType,
  } = deploy;

  const statusIcon =
    status === DeployStatus.Success ? <SuccessIcon /> : <FailureIcon />;

  return (
    <InfoCard>
      <HeadContentWrapper>
        <TransactionHeading type="h2">Transaction Details</TransactionHeading>
      </HeadContentWrapper>
      <DetailDataWrapper>
        <TransactionGrid gap="2rem">
          <DetailDataList gap="2rem">
            {!!amount && (
              <li>
                <Grid gap="1rem" templateColumns="9rem auto">
                  <DetailDataLabel>Amount</DetailDataLabel>
                  <DetailDataValue>
                    <Coin>{amount}</Coin>
                  </DetailDataValue>
                </Grid>
              </li>
            )}
            <li>
              <Grid gap="1rem" templateColumns="9rem 1fr">
                <DetailDataLabel>Cost</DetailDataLabel>
                <DetailDataValue>
                  <Coin>{cost}</Coin>
                </DetailDataValue>
              </Grid>
            </li>
            <li>
              <Grid gap="1rem" templateColumns="9rem 1fr">
                <DetailDataLabel>Payment Amount</DetailDataLabel>
                <DetailDataValue>
                  <Coin>{paymentAmount}</Coin>
                </DetailDataValue>
              </Grid>
            </li>
          </DetailDataList>
          <Grid templateColumns="1fr 1fr" templateRows="1fr" gap="2rem 1rem">
            <div>
              <DetailDataLabel>Timestamp</DetailDataLabel>
              <TransactionDetailData>{readableTimestamp}</TransactionDetailData>
            </div>
            <HideOnMobile>
              <div>
                <DetailDataLabel>Status</DetailDataLabel>
                <DeployStatusData>
                  {status}
                  <StatusIconWrapper>{statusIcon}</StatusIconWrapper>
                </DeployStatusData>
              </div>
            </HideOnMobile>
            <HideOnDesktop>
              <SpanTwoCols>
                <DetailDataLabel>Status</DetailDataLabel>
                <DeployStatusData>
                  {status}
                  <StatusIconWrapper>{statusIcon}</StatusIconWrapper>
                </DeployStatusData>
              </SpanTwoCols>
            </HideOnDesktop>
            <ActionAndDeployTypeWrapper>
              <DetailDataLabel>Action</DetailDataLabel>
              <TransactionDetailData>{action}</TransactionDetailData>
            </ActionAndDeployTypeWrapper>
            {!!deployType && (
              <ActionAndDeployTypeWrapper>
                <DetailDataLabel>Deploy Type</DetailDataLabel>
                <TransactionDetailData>{deployType}</TransactionDetailData>
              </ActionAndDeployTypeWrapper>
            )}
          </Grid>
        </TransactionGrid>
      </DetailDataWrapper>
    </InfoCard>
  );
};

const TransactionGrid = styled(Grid)`
  grid-template-columns: 1fr;

  @media only screen and (min-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const TransactionHeading = styled(Heading)`
  font-size: ${pxToRem(18)};
  font-weight: ${fontWeight.medium};
`;

const TransactionDetailData = styled.div`
  font-size: ${pxToRem(26)};
`;

const DeployStatusData = styled(TransactionDetailData)`
  display: flex;
  gap: 0.75rem;
`;

const SpanTwoCols = styled(TransactionDetailData)`
  grid-column: span 2;
`;

const ActionAndDeployTypeWrapper = styled(SpanTwoCols)`
  flex-direction: column;
  font-family: ${fonts.jetBrains};

  div {
    font-size: ${pxToRem(24)};
  }
`;

const StatusIconWrapper = styled.span`
  display: block;
  width: 1.875rem;
  position: relative;
  top: 0.3rem;
`;
