import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Deploy } from '../../../api';
import { Heading, InfoCard, HeadContentWrapper } from '../../base';
import {
  GradientHeading,
  Hash,
  DetailDataLabel,
  DetailDataWrapper,
  DetailDataValue,
  DetailDataList,
} from '../../styled';

import { CopyToClipboard, RawData } from '../../utility';
import { fontWeight } from '../../../styled-theme';

export interface DeployDetailsCardProps {
  deploy: Deploy;
}

export const DeployDetailsCard: React.FC<DeployDetailsCardProps> = ({
  deploy,
}) => {
  const { deployHash, blockHash, publicKey, rawDeploy } = deploy;
  const { t } = useTranslation();

  return (
    <InfoCard>
      <HeadContentWrapper>
        <DeployHeading type="h1">{t('deploy-details')}</DeployHeading>
        <HashHeading type="h2">
          <Hash hash={deployHash} alwaysTruncate />
        </HashHeading>
      </HeadContentWrapper>
      <DetailDataWrapper>
        <DetailDataList>
          <li>
            <DetailDataLabel>{t('block-hash')}</DetailDataLabel>
            <DetailDataValue>
              <Link to={`/block/${blockHash}`}>
                <Hash hash={blockHash} />
              </Link>
              <CopyToClipboard textToCopy={blockHash} />
            </DetailDataValue>
          </li>
          <li>
            <DetailDataLabel>{t('public-key')}</DetailDataLabel>
            <DetailDataValue>
              <Link to={`/account/${publicKey}`}>
                <Hash hash={publicKey} />
              </Link>
              <CopyToClipboard textToCopy={publicKey} />
            </DetailDataValue>
          </li>
          <li>
            <DetailDataLabel>{t('deploy-hash')}</DetailDataLabel>
            <DetailDataValue>
              <Hash hash={deployHash} />
              <CopyToClipboard textToCopy={deployHash} />
            </DetailDataValue>
          </li>
          <li>
            <DetailDataLabel>{t('raw-data')}</DetailDataLabel>
            <DetailDataValue>
              <RawData rawData={rawDeploy} />
            </DetailDataValue>
          </li>
        </DetailDataList>
      </DetailDataWrapper>
    </InfoCard>
  );
};

const DeployHeading = styled(Heading)`
  font-size: 1.125rem;
  font-weight: ${fontWeight.medium};
  margin-bottom: 1rem;
`;

const HashHeading = styled(GradientHeading)`
  font-weight: ${fontWeight.extraBold};
`;
