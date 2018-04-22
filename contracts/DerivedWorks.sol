// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface ITNT165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface ITNT721 is ITNT165 {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function approve(address to, uint256 tokenId) external;

    function getApproved(uint256 tokenId)
        external
        view
        returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;
}

interface ITNT721Metadata is ITNT721 {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function tokenURI(uint256 tokenId) external view returns (string memory);
}

interface ITNT721Enumerable is ITNT721 {
    function totalSupply() external view returns (uint256);

    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256 tokenId);

    function tokenByIndex(uint256 index) external view returns (uint256);
}

library Assertions {
    // isValidNFT();
}

contract Lendable {
    ITNT721 public immutable nft;
    uint256 public immutable tokenId;
    bool public useOneTimeFee;
    bool public useCommissions;
    bool public requireAttribution;

    struct Options {
        bool useOneTimeFee;
        bool useCommissions;
        bool requireAttribution;
        uint16 oneTimeFee;
        uint16 commission;
    }

    uint16 public oneTimeFee;
    // commission encoded as a hundreth of a %, i.e. N% x 100
    uint16 public commission;

    bytes4 private constant _INTERFACE_ID_TNT165 = 0x01ffc9a7;
    bytes4 private constant _INTERFACE_ID_TNT721 = 0x80ac58cd;
    bytes4 private constant _INTERFACE_ID_TNT721_METADATA = 0x5b5e139f;
    bytes4 private constant _INTERFACE_ID_TNT721_ENUMERABLE = 0x780e9d63;

    // impl the default receive https://docs.soliditylang.org/en/v0.8.13/contracts.html#receive-ether-function
    receive() external payable {
        payable(nft.ownerOf(tokenId)).transfer(msg.value);
    }

    function owner() public view returns (address _owner) {
        return nft.ownerOf(tokenId);
    }

    constructor(
        address _nft,
        uint256 _tokenId,
        Options memory options
    ) {
        ITNT721 tmp = ITNT721(_nft);
        require(
            tmp.supportsInterface(_INTERFACE_ID_TNT165),
            "NFT must support TNT165"
        );
        require(
            tmp.supportsInterface(_INTERFACE_ID_TNT721),
            "NFT must support TNT721"
        );
        require(
            tmp.supportsInterface(_INTERFACE_ID_TNT721_METADATA),
            "NFT must support TNT721 metadata"
        );
        require(
            tmp.supportsInterface(_INTERFACE_ID_TNT721_ENUMERABLE),
            "NFT must support TNT721 enumerable"
        );
        if (options.useCommissions) {
            require(options.commission < 2000, "cannot take more than 20% cut");
        }

        nft = tmp;
        tokenId = _tokenId;
        requireAttribution = options.requireAttribution;

        useOneTimeFee = options.useOneTimeFee;
        if (useOneTimeFee) {
            oneTimeFee = options.oneTimeFee;
        }

        useCommissions = options.useCommissions;
        if (useCommissions) {
            commission = options.commission;
        }
    }
}

contract DerivativeWork {
    ITNT721 work;
    uint256 tokenId;
    DerivativePart[] parts;

    enum DerivativePayment {
        OneTimeFee,
        Commissions
    }

    struct DerivativePart {
        Lendable lendable;
        DerivativePayment payment;
    }

    // impl the default receive https://docs.soliditylang.org/en/v0.8.13/contracts.html#receive-ether-function
    receive() external payable {
        uint256 total = msg.value;
        uint256 remainder = msg.value;
        address[] memory addressesToPay = new address[](parts.length);
        uint256[] memory cost = new uint256[](parts.length);
        uint256 j = 0;
        for (uint256 i = 0; i < parts.length; i++) {
            if (parts[i].payment == DerivativePayment.Commissions) {
                Lendable lendable = parts[i].lendable;
                uint256 cut = (total * lendable.commission()) / 100;

                addressesToPay[j] = lendable.owner();
                cost[j] = cut;
                j += 1;
                remainder -= cut;
            }
        }

        for (uint256 i = 0; i < j; i++) {
            payable(addressesToPay[i]).transfer(cost[i]);
        }

        payable(work.ownerOf(tokenId)).transfer(remainder);
    }

    constructor(
        address _work,
        uint256 _tokenId,
        DerivativePart[] memory _parts
    ) payable {
        require(_parts.length < 30, "cannot exceed 30 derivative works");

        uint64 totalCommissions = 0;
        for (uint32 i = 0; i < _parts.length; i++) {
            if (_parts[i].payment == DerivativePayment.Commissions) {
                require(
                    _parts[i].lendable.useCommissions(),
                    "attempted to use commission for a lendable that doesn't allow that option"
                );
                totalCommissions += _parts[i].lendable.commission();
            }
        }

        require(
            totalCommissions < 10000,
            "The total commissions cannot exceed 100%"
        );

        work = ITNT721(_work);
        tokenId = _tokenId;

        for (uint32 i = 0; i < _parts.length; i++) {
            parts.push(_parts[i]);
        }
    }
}
