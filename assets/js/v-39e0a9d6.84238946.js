"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3995],{5010:(n,s,a)=>{a.r(s),a.d(s,{data:()=>p});const p={key:"v-39e0a9d6",path:"/guide/services/crud.html",title:"CRUD",lang:"en-US",frontmatter:{},excerpt:"",headers:[{level:3,title:"Search vs Filter",slug:"search-vs-filter",children:[]},{level:3,title:"defining columns",slug:"defining-columns",children:[]}],filePathRelative:"guide/services/crud.md",git:{updatedTime:165656299e4,contributors:[{name:"Anton",email:"a.shumansky@gmail.com",commits:1},{name:"h-khodadadeh",email:"khodadadeh@coretrix.com",commits:1}]}}},6479:(n,s,a)=>{a.r(s),a.d(s,{default:()=>e});const p=(0,a(6252).uE)('<h1 id="crud" tabindex="-1"><a class="header-anchor" href="#crud" aria-hidden="true">#</a> CRUD</h1><p>This service it gives you ability to build gql query and apply different query parameters to the query that should be used in listing pages</p><p>Register the service into your <code>main.go</code> file:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>registry<span class="token punctuation">.</span><span class="token function">ServiceProviderCrud</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Access the service:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>service<span class="token punctuation">.</span><span class="token function">DI</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Crud</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="search-vs-filter" tabindex="-1"><a class="header-anchor" href="#search-vs-filter" aria-hidden="true">#</a> Search vs Filter</h3><p>Search is used on strings while filtering can be used on wide range of data types. One important note to remember is that if your column is searchable it can&#39;t be filterable.</p><h3 id="defining-columns" tabindex="-1"><a class="header-anchor" href="#defining-columns" aria-hidden="true">#</a> defining columns</h3><p>First you need to define what columns you&#39;re going to have and which of them will be Searchable, Sortable or Filterable(user for enum values). Using this configuration you also define the supported filters that can be applied.</p><p>The second step is in your controller(handler) to call few methods from that service that will build the right query for you based on the request. Crud service supports mysql query builder and redis-search query builder.</p><p>Example of the way you can use it:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token comment">//defining columns.</span>\n<span class="token keyword">func</span> <span class="token function">columns</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>crud<span class="token punctuation">.</span>Column <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>crud<span class="token punctuation">.</span>Column<span class="token punctuation">{</span>\n            <span class="token punctuation">{</span>\n                Key<span class="token punctuation">:</span>            <span class="token string">&quot;ID&quot;</span><span class="token punctuation">,</span>\n                Type<span class="token punctuation">:</span>           crud<span class="token punctuation">.</span>NumberType<span class="token punctuation">,</span>\n                Label<span class="token punctuation">:</span>          <span class="token string">&quot;ID&quot;</span><span class="token punctuation">,</span>\n                Searchable<span class="token punctuation">:</span>     <span class="token boolean">false</span><span class="token punctuation">,</span>\n                Sortable<span class="token punctuation">:</span>       <span class="token boolean">true</span><span class="token punctuation">,</span>\n                Visible<span class="token punctuation">:</span>        <span class="token boolean">true</span><span class="token punctuation">,</span>\n                Filterable<span class="token punctuation">:</span>     <span class="token boolean">true</span><span class="token punctuation">,</span>\n                FilterValidMap<span class="token punctuation">:</span> <span class="token boolean">nil</span><span class="token punctuation">,</span>\n            <span class="token punctuation">}</span><span class="token punctuation">,</span>\n            <span class="token punctuation">{</span>\n                Key<span class="token punctuation">:</span>            <span class="token string">&quot;Name&quot;</span><span class="token punctuation">,</span>\n                Type<span class="token punctuation">:</span>           crud<span class="token punctuation">.</span>StringType<span class="token punctuation">,</span>\n                Label<span class="token punctuation">:</span>          <span class="token string">&quot;Name&quot;</span><span class="token punctuation">,</span>\n                Searchable<span class="token punctuation">:</span>     <span class="token boolean">true</span><span class="token punctuation">,</span>\n                Sortable<span class="token punctuation">:</span>       <span class="token boolean">false</span><span class="token punctuation">,</span>\n                Visible<span class="token punctuation">:</span>        <span class="token boolean">true</span><span class="token punctuation">,</span>\n                Filterable<span class="token punctuation">:</span>     <span class="token boolean">false</span><span class="token punctuation">,</span>\n                FilterValidMap<span class="token punctuation">:</span> <span class="token boolean">nil</span><span class="token punctuation">,</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token comment">//listing request using by gql</span>\n<span class="token keyword">type</span> ListRequest <span class="token keyword">struct</span> <span class="token punctuation">{</span>\n    Page     <span class="token operator">*</span><span class="token builtin">int</span>                   <span class="token string">`json:&quot;Page&quot;`</span>\n    PageSize <span class="token operator">*</span><span class="token builtin">int</span>                   <span class="token string">`json:&quot;PageSize&quot;`</span>\n    Filter   <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token string">`json:&quot;Filter&quot;`</span>\n    Search   <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token string">`json:&quot;Search&quot;`</span>\n    SearchOr <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token string">`json:&quot;SearchOR&quot;`</span>\n    Sort     <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token string">`json:&quot;Sort&quot;`</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>and at the end your method where you return the response:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>cols <span class="token operator">:=</span> <span class="token function">columns</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\ncrudService <span class="token operator">:=</span> service<span class="token punctuation">.</span><span class="token function">DI</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">CrudService</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\nsearchParams <span class="token operator">:=</span> crudService<span class="token punctuation">.</span><span class="token function">ExtractListParams</span><span class="token punctuation">(</span>cols<span class="token punctuation">,</span> crud<span class="token punctuation">.</span><span class="token function">ListRequestConvertorFromGQL</span><span class="token punctuation">(</span>userListRequest<span class="token punctuation">)</span><span class="token punctuation">)</span>\nquery <span class="token operator">:=</span> crudService<span class="token punctuation">.</span><span class="token function">GenerateListRedisSearchQuery</span><span class="token punctuation">(</span>searchParams<span class="token punctuation">)</span>\n\normService <span class="token operator">:=</span> ioc<span class="token punctuation">.</span><span class="token function">GetOrmEngineFromContext</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span>\n<span class="token keyword">var</span> userEntities <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">*</span>entity<span class="token punctuation">.</span>UserEntity\n\normService<span class="token punctuation">.</span><span class="token function">RedisSearch</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>userEntities<span class="token punctuation">,</span> query<span class="token punctuation">,</span> beeorm<span class="token punctuation">.</span><span class="token function">NewPager</span><span class="token punctuation">(</span>searchParams<span class="token punctuation">.</span>Page<span class="token punctuation">,</span> searchParams<span class="token punctuation">.</span>PageSize<span class="token punctuation">)</span><span class="token punctuation">)</span>\n\nuserEntityList <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">*</span>model<span class="token punctuation">.</span>User<span class="token punctuation">,</span> <span class="token function">len</span><span class="token punctuation">(</span>userEntities<span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n<span class="token keyword">for</span> i<span class="token punctuation">,</span> userEntity <span class="token operator">:=</span> <span class="token keyword">range</span> userEntities <span class="token punctuation">{</span>\n    userEntityList<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> populate<span class="token punctuation">.</span><span class="token function">UserAdmin</span><span class="token punctuation">(</span>userEntity<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">return</span> <span class="token operator">&amp;</span>model<span class="token punctuation">.</span>UserList<span class="token punctuation">{</span>\n    Rows<span class="token punctuation">:</span>    userEntityList<span class="token punctuation">,</span>\n    Total<span class="token punctuation">:</span>   <span class="token function">len</span><span class="token punctuation">(</span>userEntityList<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    Columns<span class="token punctuation">:</span> crud<span class="token punctuation">.</span><span class="token function">ColumnConvertorToGQL</span><span class="token punctuation">(</span>cols<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token boolean">nil</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div>',16),t={},e=(0,a(3744).Z)(t,[["render",function(n,s){return p}]])},3744:(n,s)=>{s.Z=(n,s)=>{for(const[a,p]of s)n[a]=p;return n}}}]);