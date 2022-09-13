import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { useParams } from 'react-router-dom';
import { Deploy } from '../types';
import { truncateHash } from '../utils';
import { DeployDetailsCard, PageError, PageWrapper } from '../components';

import { casperApi } from '../api';

export const DeployPage: React.FC = () => {
  const { id: deployHash } = useParams();

  const [deploy, setDeploy] = useState<Deploy>();
  const [error, setError] = useState<PageError>();

  useAsyncEffect(async () => {
    if (deployHash) {
      const deployData = await casperApi.getDeploy(deployHash);

      if (!deployData) {
        setError({
          message: `We were unable to locate Account data for hash ${deployHash}`,
        });
        return;
      }

      setDeploy(deployData);
    } else {
      setError({
        message:
          'We were unable to fetch deploy. Please check if your url includes an deploy hash.',
      });
    }
  }, [deployHash]);

  const isLoading = !deploy;

  if (error) {
    return (
      <div className="w-full h-[75vh] px-48 mt-24">
        <div className="w-full max-w-1200">
          <h2 className="text-24 mb-8">Whoops! Something went wrong!</h2>
          <p>We were unable to fetch block with hash:</p>
          <h3>{deployHash}</h3>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper error={error} isLoading={isLoading}>
      {!isLoading && deployHash && (
        <>
          <div className="w-full text-black mb-24">
            <h2 className="text-24 mb-16">
              Deploy:{' '}
              <span className="tracking-2 font-normal">
                {truncateHash(deployHash)}
              </span>
            </h2>
          </div>
          <DeployDetailsCard deploy={deploy} />
        </>
      )}
    </PageWrapper>
  );
};
