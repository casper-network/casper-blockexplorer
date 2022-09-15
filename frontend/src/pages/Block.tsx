import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { useParams } from 'react-router-dom';
import { Block } from '../types';
import { truncateHash } from '../utils';
import { BlockDetailsCard, PageError, PageWrapper } from '../components';
import { casperApi } from '../api';

export const BlockPage: React.FC = () => {
  const { id: blockHash } = useParams();

  const [block, setBlock] = useState<Block>();
  const [error, setError] = useState<PageError>();

  useAsyncEffect(async () => {
    if (blockHash) {
      try {
        const blockData = await casperApi.getBlock(blockHash);

        if (!blockData) {
          setError({
            message: `We were unable to locate block data for hash ${blockHash}`,
          });
          return;
        }

        setBlock(blockData);
      } catch (err: any) {
        setError({
          message: (err as Error).message,
        });
      }
    }
  }, [blockHash]);

  const isLoading = !block;

  return (
    <PageWrapper error={error} isLoading={isLoading}>
      {!isLoading && blockHash && (
        <>
          <div className="w-full text-black mb-24">
            <h2 className="text-24 mb-16">
              Block:{' '}
              <span className="tracking-2 font-normal">
                {truncateHash(blockHash)}
              </span>
            </h2>
          </div>
          <BlockDetailsCard block={block} />
        </>
      )}
    </PageWrapper>
  );
};
