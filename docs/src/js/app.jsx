import React from 'react';
import ReactDOM from 'react-dom/client';

const HASHNODE_HOST = "hoctusangdentoi.thanhhao.me";

const createQuery = (cursor) => {
    // Anti-cache tip: Add Date.now() to name query (GetPosts_${Date.now()})
    // Each time this function is called, the query name will be different -> Server is forced to return new data.
    const dynamicQueryName = `GetPosts_${Date.now()}`;

    // Pagination logic: If there is a cursor, add the parameter `after: "cursor"`, otherwise leave it empty
    const afterParam = cursor ? `, after: "${cursor}"` : "";

    return `
    query ${dynamicQueryName} {
      publication(host: "${HASHNODE_HOST}") {
        title
        posts(first: 12 ${afterParam}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              subtitle
              brief
              url
              canonicalUrl
              coverImage { url }
              tags { name }
            }
          }
        }
      }
    }
    `;
};

const mapPostsToProducts = (posts) => {
    return posts.map(edge => {
        const post = edge.node;

        return {
            id: post.id,
            name: post.title,
            url: post.canonicalUrl,
            description: post.subtitle || post.brief,
            thumbnail: post.coverImage ? post.coverImage.url : "",
            categories: post.tags ? post.tags.map(tag => {
                const cleanName = tag.name.trim();
                if (cleanName.length > 0) {
                    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                }
                return cleanName;
            }) : []
        };
    });
}

// Your React component code goes here
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            ready: false,
            searchText: '', // To store the search text
            selectedCategory: 'All', // To store the selected category
            products: [], // Initialize products as an empty array
        };
    }

    componentDidMount() {
        // Load the initial product list from an external source
        this.loadInitialProductList();
    }

    async loadInitialProductList() {
        let hasNextPage = true; // Flag to mark next page
        let endCursor = null;   // The cursor marks the position of the last card taken.
        let products = [];

        try {
            const categories = {}

            // Pagination Loop
            while (hasNextPage) {
                const query = createQuery(endCursor);

                const response = await fetch('https://gql.hashnode.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    },
                    body: JSON.stringify({ query }),
                });

                const json = await response.json();
                if (json.errors) throw new Error(JSON.stringify(json.errors));

                const postsData = json.data.publication.posts;

                // Update pagination status
                hasNextPage = postsData.pageInfo.hasNextPage;
                endCursor = postsData.pageInfo.endCursor;

                // Collect newly obtained articles into a common array
                products = [...products, ...mapPostsToProducts(postsData.edges)];

                // Iterate over the rows
                products.forEach(product => product.categories.forEach(cat => categories[cat] = 1));

                // Render partial products
                this.setState({
                    products: products
                });
            }

            // Set the products in the component state
            this.setState({
                ready: true,
                products: products,
                categories: Object.keys(categories).sort((a, b) => {
                    if (a.length !== b.length) return a.length - b.length;
                    return a.localeCompare(b);
                })
            });
        } catch (error) {
            console.error('Error loading initial product list:', error);
        }
    }

    handleSearch = (e) => {
        this.setState({ searchText: e.target.value });
    }

    handleCategoryChange = (e, category) => {
        e.preventDefault();
        this.setState({ selectedCategory: category });
    }

    filterProducts = () => {
        const { searchText, selectedCategory, products } = this.state;
        return products.filter(product => {
            // Filter products based on the search text and selected category
            const textMatch = product.name.toLowerCase().includes(searchText.toLowerCase());
            const categoryMatch = selectedCategory === 'All' || product.categories.includes(selectedCategory);
            return textMatch && categoryMatch;
        });
    }

    render() {
        const { searchText, selectedCategory, categories, ready } = this.state;
        const filteredProducts = this.filterProducts();
        return (
            <div className="page-profile--body" style={{ maxWidth: '100%' }}>
                <div className="page-profile--header ">
                    <div className="box-profile ">
                        <div className="box-profile-left">
                            <div className="prf-img">
                                <div className="rounded-circle">
                                    <img className="rounded-circle lazyloaded"
                                        data-src="uploads/avatar.jpeg"
                                        alt=""
                                        src="uploads/avatar.jpeg" />
                                </div>
                            </div>
                        </div>
                        <div className="box-profile-middle ">
                            <div className="prf-name-bar">
                                <div className="prf-name-bar--title d-flex align-items-center mobile-title-center">
                                    <span className="prf-name mr-1">Học từ sáng đến tối</span>
                                </div>
                                <div className="list-profile--social lazyloaded">
                                    <ul className="list-unstyled prf-social">
                                        <li>
                                            <a target="_blank" href="https://www.tiktok.com/@hoctusangdentoi">
                                                <i className="prf-icon icon-ttk-circle"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="prf-info">
                                <p className="mb-2">Đồng hành cùng quãng thời gian nỗ lực của 2 đứa</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-profile--content">
                    <div className="tab-content">
                        <div className="tab-pane fade lazyloaded active show">
                            <div className="input-group mb-3 mt-3 input-group-sm col-sm-12 control-form-search">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-color-btn-search">
                                        <i className="fa fa-search" aria-hidden="true" />
                                    </span>
                                </div>
                                <input type="search" className="form-control" name="search"
                                    placeholder="Tìm kiếm sản phẩm"
                                    value={searchText}
                                    onChange={this.handleSearch} />
                            </div>
                            <div className="profile-tabs--desp reset-scroll">
                                <ul className="list-unstyled" id="swiper">
                                    <li className={selectedCategory === 'All' ? 'active' : ''}>
                                        <a href="" className="sortByCate"
                                            onClick={e => this.handleCategoryChange(e, 'All')}>Tất cả</a>
                                    </li>
                                    {ready ? categories.map(cat => (
                                        <li
                                            key={cat}
                                            className={selectedCategory === cat ? 'active' : ''}
                                        >
                                            <a className="sortByCate"
                                                onClick={e => this.handleCategoryChange(e, cat)}>{cat}</a>
                                        </li>
                                    )) : (
                                        <li>
                                            <span className="sortByCate shimmerBG"
                                                onClick={e => this.handleCategoryChange(e, 'All')}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="profile-tabs--group">
                                <div className="profile-tabs--listgrid">
                                    {filteredProducts.map(product => (
                                        <div key={product.id} className="tabs--listgrid-item">
                                            <a target="_blank" className="listgrid--link" href={product.url}>
                                                <div className="listgrid--linkbody">
                                                    <div className="listgrid--img" style={{ height: '181px' }}>
                                                        <img className="lazyloaded"
                                                            data-src={product.thumbnail}
                                                            alt={product.description}
                                                            src={product.thumbnail} />
                                                    </div>
                                                    <div className="listgrid--linkfooter"></div>
                                                </div>
                                                <div className="listgrid--linktitle">
                                                    <h5 className="title">{product.name}</h5>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                    {!ready && Array.from({ length: 4 }, (_, index) => index + 1).map(index => (
                                        <div key={-index} className="tabs--listgrid-item">
                                            <span className="listgrid--link shimmerBG">
                                                <div className="listgrid--linkbody">
                                                    <div className="listgrid--img" style={{ height: '181px' }}></div>
                                                    <div className="listgrid--linkfooter"></div>
                                                </div>
                                                <div className="listgrid--linktitle">
                                                </div>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Render the component into the 'root' div
const container = document.getElementById('page-profile--main');
const root = ReactDOM.createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
