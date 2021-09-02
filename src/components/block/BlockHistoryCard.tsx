import React from "react";
import { BlockResponse } from "@solana/web3.js";
import { ErrorCard } from "components/common/ErrorCard";
import { Signature } from "components/common/Signature";
import { Address } from "components/common/Address";

const PAGE_SIZE = 25;

export function BlockHistoryCard({ block }: { block: BlockResponse }) {
  const [numDisplayed, setNumDisplayed] = React.useState(PAGE_SIZE);

  if (block.transactions.length === 0) {
    return <ErrorCard text="This block has no transactions" />;
  }

  return (
    <div className="card">
      <div className="card-header align-items-center">
        <h3 className="card-header-title">Block Transactions</h3>
      </div>

      <div className="table-responsive mb-0">
        <table className="table table-sm table-nowrap card-table">
          <thead>
            <tr>
              <th className="text-muted">Result</th>
              <th className="text-muted">Transaction Signature</th>
              <th className="text-muted">Invoked Programs</th>
            </tr>
          </thead>
          <tbody className="list">
            {block.transactions.slice(0, numDisplayed).map((tx, i) => {
              let statusText;
              let statusClass;
              if (tx.meta?.err) {
                statusClass = "warning";
                statusText = "Failed";
              } else {
                statusClass = "success";
                statusText = "Success";
              }

              let programIndexes = tx.transaction.message.instructions.map(
                (ix) => ix.programIdIndex
              );
              programIndexes = programIndexes.filter(
                (value, index) => programIndexes.indexOf(value) === index
              );

              return (
                <tr key={i}>
                  <td>
                    <span className={`badge badge-soft-${statusClass}`}>
                      {statusText}
                    </span>
                  </td>

                  <td>
                    <Signature
                      signature={tx.transaction.signatures[0]}
                      link
                      truncateChars={48}
                    />
                  </td>
                  <td>
                    {programIndexes.length === 0
                      ? "NA"
                      : programIndexes.map((i) => {
                          return (
                            <Address
                              key={i}
                              pubkey={tx.transaction.message.accountKeys[i]}
                              link
                            />
                          );
                        })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {block.transactions.length > numDisplayed && (
        <div className="card-footer">
          <button
            className="btn btn-primary w-100"
            onClick={() =>
              setNumDisplayed((displayed) => displayed + PAGE_SIZE)
            }
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
