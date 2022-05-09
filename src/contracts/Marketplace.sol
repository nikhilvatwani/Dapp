pragma solidity >=0.4.21 <0.6.0;
import "./InfinityToken.sol";

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;
    address admin;
    InfinityToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    

    struct Product {
        uint id;
        string name;
        uint256 price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    constructor(InfinityToken _tokenContract, uint256 _tokenPrice) public {
        name = "Resume Marketplace";
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        
    }

    modifier onlyBuyer(address owner) {
      require(msg.sender != owner);
      _;
    }

    modifier checkBuyingPrice(uint price) {
      require(msg.value/100 >= price);
      _;
    }

    modifier checkvalidProduct(string  memory _name, uint _price) {
      require(bytes(_name).length > 0 && _price > 0);
      _;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function createProduct(string memory _name, uint256 _price) public checkvalidProduct(_name,_price) {
        productCount ++;
        products[productCount] = Product(productCount, _name, _price/100, msg.sender, false);
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable onlyBuyer(products[_id].owner) checkBuyingPrice(products[_id].price){
        Product memory _product = products[_id];
        //require(msg.value == multiply(_product.price, tokenPrice));
        //require(tokenContract.balanceOf(msg.sender) >= _product.price);
        address payable _seller = _product.owner;
        require(_product.id > 0 && _product.id <= productCount);
        require(!_product.purchased);
        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;
        //tokenContract.transfer(_seller, _product.price);
        // address(_seller).transfer(msg.value);
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }

    function getSellerAddress(uint _id) public returns(address sellerAddress){
        Product memory _product = products[_id];
        //require(msg.value == multiply(_product.price, tokenPrice));
        //require(tokenContract.balanceOf(msg.sender) >= _product.price);
        address _seller = _product.owner;
        return _seller;
        //tokenContract.transfer(_seller, _product.price);
        // address(_seller).transfer(msg.value);
    }
}
