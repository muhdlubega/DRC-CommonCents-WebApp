import React, { useEffect, useState } from "react";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import { useParams } from "react-router-dom";

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const Contract: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedContract, setSelectedContract] = useState<string>("");
  const contracts_for_symbol_request = {
    contracts_for: id,
    currency: "USD",
    landing_company: "svg",
    product_type: "basic",
  };
  const [contracts, setContracts] = useState<any[]>([]);

  const contractsForSymbolResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error : ", data.error?.message);
      connection.removeEventListener(
        "message",
        contractsForSymbolResponse,
        false
      );
      await api.disconnect();
    }

    if (data.msg_type === "contracts_for") {
      const filteredContracts = data.contracts_for.available.filter(
        (contract: any) => contract.expiry_type === "tick"
      );
      setContracts(filteredContracts);
      console.log(filteredContracts);
    }

    connection.removeEventListener(
      "message",
      contractsForSymbolResponse,
      false
    );
  };

  const getContractsForSymbol = async () => {
    connection.addEventListener("message", contractsForSymbolResponse);
    await api.contractsFor(contracts_for_symbol_request);
  };

  useEffect(() => {
    getContractsForSymbol();
    const symbol_button = document.querySelector<HTMLButtonElement>(
      "#contractsForSymbol"
    );
    symbol_button?.addEventListener("click", getContractsForSymbol);

    return () => {
      symbol_button?.removeEventListener("click", getContractsForSymbol);
    };
  }, []);

  return (
    <div>
      <button hidden id="contractsForSymbol">
        Get contracts for symbol
      </button>
      <div id="contractsContainer">
        {contracts.length > 0 && (
          <select
            style={{
              width: '95%',
              margin: '10px',
              borderRadius: '10px',
              // size: '10px',
              height: '40px'
            }}
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
          >
            <option value="">Select a contract</option>
            {Array.from(
              contracts.reduce((map: Map<string, any[]>, contract: any) => {
                const { contract_category_display } = contract;
                if (!map.has(contract_category_display)) {
                  map.set(contract_category_display, []);
                }
                map.get(contract_category_display)?.push(contract);
                return map;
              }, new Map<string, any[]>())
            ).map(([category, contracts]) => (
              <optgroup label={category} key={category}>
                {contracts.map((contract: any, index: number) => (
                  <option
                    key={index}
                    value={contract.underlying_symbol}
                    title={`${contract.contract_category_display}\n${contract.contract_display}\n${contract.expiry_type}`}
                  >
                    {`${contract.contract_display} (${contract.barrier_category.replaceAll('_', '-')})`}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default Contract;
