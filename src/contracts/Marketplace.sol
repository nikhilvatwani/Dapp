pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Resume Marketplace";
    }

    modifier onlyBuyer(address owner) {
      require(msg.sender != owner);
      _;
    }

    modifier checkBuyingPrice(uint price) {
      require(msg.value >= price);
      _;
    }

    modifier checkvalidProduct(string  memory _name, uint _price) {
      require(bytes(_name).length > 0 && _price > 0);
      _;
    }

    function createProduct(string memory _name, uint _price) public checkvalidProduct(_name,_price) {
        productCount ++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable onlyBuyer(products[_id].owner) checkBuyingPrice(products[_id].price){
        Product memory _product = products[_id];
        address payable _seller = _product.owner;
        require(_product.id > 0 && _product.id <= productCount);
        require(!_product.purchased);
        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;
        address(_seller).transfer(msg.value);
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}
