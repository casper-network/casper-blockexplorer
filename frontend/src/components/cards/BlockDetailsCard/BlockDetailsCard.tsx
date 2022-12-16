import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Block } from '../../../api';
import { HeadContentWrapper, Heading, InfoCard } from '../../base';
import {
  DetailDataLabel,
  DetailDataValue,
  DetailDataWrapper,
  GradientHeading,
  Hash,
} from '../../styled';
import { CopyToClipboard, RawData } from '../../utility';

export interface BlockDetailsCardProps {
  block: Block;
}

export const BlockDetailsCard: React.FC<BlockDetailsCardProps> = ({
  block,
}) => {
  const {
    hash: blockHash,
    readableTimestamp,
    height: blockHeight,
    eraID: era,
    parentHash,
    stateRootHash,
    validatorPublicKey,
    transferHashes,
    deployHashes,
    rawBlock,
  } = block;

  return (
    <InfoCard>
      <HeadContentWrapper>
        <AccountHeading type="h1">Block Details</AccountHeading>

        <HashHeading type="h2">
          <Hash hash={blockHash} alwaysTruncate />
        </HashHeading>
      </HeadContentWrapper>
      <DetailDataRowWrapper>
        <li>
          <DetailDataLabel>Block Height</DetailDataLabel>
          <DetailDataValue>{blockHeight}</DetailDataValue>
        </li>
        <li>
          <DetailDataLabel>Current Era</DetailDataLabel>
          <DetailDataValue>{era}</DetailDataValue>
        </li>
        <li>
          <DetailDataLabel>Timestamp</DetailDataLabel>
          <DetailDataValue>{readableTimestamp}</DetailDataValue>
        </li>
      </DetailDataRowWrapper>
      <DetailDataWrapper>
        <li>
          <DetailDataLabel>Parent Hash</DetailDataLabel>
          <DetailDataValue>
            <Link
              to={{
                pathname: `/block/${parentHash}`,
              }}>
              <Hash hash={parentHash} />
            </Link>
            <CopyToClipboard textToCopy={parentHash} />
          </DetailDataValue>
        </li>
        <li>
          <DetailDataLabel>Block Hash</DetailDataLabel>
          <DetailDataValue>
            <Hash hash={blockHash} />
            <CopyToClipboard textToCopy={blockHash} />
          </DetailDataValue>
        </li>
        <li>
          <DetailDataLabel>State Root Hash</DetailDataLabel>
          <DetailDataValue>
            {stateRootHash ? <Hash hash={stateRootHash} /> : ''}
          </DetailDataValue>
        </li>
        <li>
          <DetailDataLabel>Validator</DetailDataLabel>
          <DetailDataValue>
            <Link
              to={{
                pathname: `/account/${validatorPublicKey}`,
              }}>
              <Hash hash={validatorPublicKey} />
            </Link>
            <CopyToClipboard textToCopy={validatorPublicKey} />
          </DetailDataValue>
        </li>
      </DetailDataWrapper>
      <DetailDataRowWrapper>
        <li>
          <DetailDataLabel>Raw Data</DetailDataLabel>
          <DetailDataValue>
            <RawData rawData={rawBlock} />
          </DetailDataValue>
        </li>
        <li>
          <DetailDataLabel>Deploys</DetailDataLabel>
          <DetailDataValue>
            {deployHashes?.length ? (
              <ul>
                {deployHashes?.map(deployHash => (
                  <li key={deployHash}>
                    <a href={`/deploy/${deployHash}`}>
                      <Hash alwaysTruncate hash={deployHash} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              'No deploys'
            )}
          </DetailDataValue>
        </li>
        <li>
          <DetailDataLabel>Transfers</DetailDataLabel>
          <DetailDataValue>
            {transferHashes?.length ? (
              <ul>
                {transferHashes?.map(transferHash => (
                  <li key={transferHash}>
                    <a href={`/deploy/${transferHash}`}>
                      <Hash alwaysTruncate hash={transferHash} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              'No transfers'
            )}
          </DetailDataValue>
        </li>
      </DetailDataRowWrapper>
    </InfoCard>
  );
};

const AccountHeading = styled(Heading)`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const HashHeading = styled(GradientHeading)`
  font-weight: 800;
  display: inline;
`;

const DetailDataRowWrapper = styled(DetailDataWrapper)`
  grid-template-columns: 0.75fr 0.75fr 3fr;
  margin: 2.5rem 0;
`;
