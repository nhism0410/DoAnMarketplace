import { useCallback, useEffect, useState } from "react";
import { useEth } from "../../contexts";

export const Marketplace = () => {
  const { state: { accounts, contracts, web3 } } = useEth();

  const [nftCollection, setNftCollection] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState('');
  const [listItem, setListItem] = useState([]);

  const getListItem = useCallback(() => {
    if (contracts.Marketplace && contracts.MyCollection) (async () => {
      const totalItem = await contracts.Marketplace.methods.totalItem().call();
      const _listItem = [];
      for (let itemId = 0; itemId < totalItem; itemId++) {
        const itemListed = await contracts.Marketplace.methods.item(itemId).call();
        const metadataOfTokenId = await contracts.MyCollection.methods
          .tokenMetadata(itemListed.tokenId)
          .call();
        const { nftContract, tokenId, seller, buyer, price } = itemListed;
        _listItem.push({
          itemId, nftContract, tokenId, seller, buyer, price,
          name: metadataOfTokenId.name,
          description: metadataOfTokenId.description,
        });
      }
      setListItem(_listItem);
    })()
  }, [contracts.Marketplace, contracts.MyCollection]);

  useEffect(() => {
    getListItem();
  }, [getListItem]);

  const sellNft = async () => {
    const priceInWei = web3.utils.toWei(price, 'ether');
    await contracts.Marketplace.methods
      .sellNft(nftCollection, tokenId, priceInWei)
      .send({ from: accounts[0] });

    getListItem();
  }

  const buyNft = async (itemId, price) => {
    await contracts.Marketplace.methods
      .buyNft(itemId)
      .send({ from: accounts[0], value: price });

    getListItem();
  }

  return (
    <div className="p-3">
      <h1><b>Marketplace</b></h1>
      <p>Address: {contracts?.Marketplace?.options?.address}</p>
      <hr />

      <h2>Sell Item</h2>
      <input
        type="text"
        placeholder="NFT Collection address"
        className="form-control my-3"
        value={nftCollection}
        onChange={event => setNftCollection(event.target.value)}
      />
      <input
        type="text"
        placeholder="Token ID"
        className="form-control my-3"
        value={tokenId}
        onChange={event => setTokenId(event.target.value)}
      />
      <input
        type="text"
        placeholder="Price (ETH)"
        className="form-control my-3"
        value={price}
        onChange={event => setPrice(event.target.value)}
      />
      <div className="btn btn-primary" onClick={sellNft}>Sell</div>
      <hr />

      {listItem?.map(item => (
        <div key={item.itemId} className="card p-3 my-3">
          <h4>#{item.itemId} {item.name}</h4>a
          <p>
            Description: {item.description}<br />
            From Collection: {item.nftContract}<br />
            Token ID: {item.tokenId.toString()}<br />
            Price: {web3.utils.fromWei(item.price, 'ether')} ETH<br />
            Seller: {item.seller}<br />
            Buyer: {item.buyer}
          </p>
          <div
            onClick={() => buyNft(item.itemId, item.price.toString())}
            className="btn btn-primary mt-2"
          >Buy</div>
        </div>
      ))}
    </div>
  )
}