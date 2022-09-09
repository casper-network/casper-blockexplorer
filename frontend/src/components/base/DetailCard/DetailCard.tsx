import React from 'react';
import { DetailCardProps } from './DetailCard.types';

export const DetailCard: React.FC<DetailCardProps> = ({ rows }) => {
  return (
    <section className="w-full m-0 p-0">
      <div className="w-full bg-[#FFF] shadow-card rounded px-16 pb-0 overflow-x-auto">
        <table className="w-full">
          <tbody>
            {rows.map(({ detailKey, value, key }) => {
              return (
                <tr key={key} className="h-50">
                  <td className="border-0 border-b-1 border-light-grey border-solid text-slate-500 whitespace-nowrap pr-32">
                    {detailKey}
                  </td>
                  <td className="h-50 border-0 border-b-1 flex items-center border-light-grey border-solid">
                    {value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};