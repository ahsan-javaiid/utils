// https://rootstock-testnet.blockscout.com/api?module=account&action=txlist&address=0x2109FF4a9D5548a21F877cA937Ac5847Fde49694&sort=asc 
// https://rootstock-testnet.blockscout.com/api?module=logs&action=getLogs&address=0x2109ff4a9d5548a21f877ca937ac5847fde49694&toBlock=latest&fromBlock=5582996&topic0=0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0

const blockscout = {
  30: 'https://rootstock.blockscout.com',
  31: 'https://rootstock-testnet.blockscout.com'
}

const fetchProposals = async (chainId, govAddress) => {
  const topic = '0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0';
  const baseUrl = blockscout[chainId];
  let fromBlock = ''; 

  try {
    const response = await fetch(`${baseUrl}/api?module=account&action=txlist&address=${govAddress}&sort=asc`);

    if (response.ok && response.status === 200) {
      const data = await response.json();
      const [firstTx] = data.result;

      if (firstTx) {
        fromBlock = firstTx.blockNumber?.toString();
      }

      const responseEvents = await fetch(`${baseUrl}/api?module=logs&action=getLogs&address=${govAddress}&toBlock=latest&fromBlock=${fromBlock}&topic0=${topic}`);

      if (responseEvents.ok && responseEvents.status === 200) {
        const eventsData = await responseEvents.json();
        return Promise.resolve(eventsData.result);
      }
      return Promise.resolve([]);
    }
    return Promise.resolve([]);
  } catch (e) {
    return Promise.resolve({ error: e });
  }
};

fetchProposals(31, '0x2109FF4a9D5548a21F877cA937Ac5847Fde49694')