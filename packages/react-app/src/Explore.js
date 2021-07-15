import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "react-apollo";
import { Link, useLocation, useHistory } from "react-router-dom";
import { EXPLORE_QUERY, INK_LIKES_QUERY } from "./apollo/queries";
import { isBlocklisted, getFromIPFS } from "./helpers";
import { Row, Divider, Select, Switch, Space, Badge, Button, Radio, Form } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { Loader } from "./components"
import { ethers } from "ethers";
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import 'antd/lib/date-picker/style/index';
import LikeButton from "./LikeButton.js"
import { useDebounce, useLocalStorage } from "./hooks";

const { Option } = Select;

const DatePicker = generatePicker(dayjsGenerateConfig);

const CustomTimeRangePicker = DatePicker.RangePicker
var dayjs = require('dayjs')

function useSearchParams() {
  let _params = new URLSearchParams(useLocation().search);
  return _params
}

export default function ForSale(props) {

  let location = useLocation();
  let searchParams = useSearchParams()

  let history = useHistory()

  let [allInks, setAllInks] = useState([]);
  let [inks, setInks] = useState({});

  let [likes, setLikes] = useState([])

  let [orderBy, setOrderBy] = useState(searchParams.get("orderBy") || 'createdAt')
  let [orderDirection, setOrderDirection] = useState(searchParams.get("orderDirection") || 'desc')

  let [startDate, setStartDate] = useState(searchParams.has("startDate") ? dayjs(searchParams.get("startDate")) : dayjs().subtract(29, 'days'))

  let [endDate, setEndDate] = useState((searchParams.has("endDate") ? dayjs(searchParams.get("endDate")) : dayjs()))

  let [forSale, setForSale] = useState(searchParams.get("forSale") || "all-inks")

  let [layout, setLayout] = useLocalStorage("exploreLayout", "cards")

  let [inkFilters, setInkFilters] = useState({
    createdAt_gt: startDate.unix(),
    createdAt_lt: endDate.unix(),
    burned: false
  })

  useEffect(() => {
    let _newFilters = {
      createdAt_gt: startDate.unix(),
      createdAt_lt: endDate.unix(),
      burned: false
    }
    if(forSale=="for-sale") {
      _newFilters.bestPrice_gt =  "0"
    }
    setInkFilters(_newFilters)
  }
, [forSale, startDate, endDate])

  const { loading, error, data, fetchMore } = useQuery(EXPLORE_QUERY, {
    variables: {
      first: 48,
      skip: 0,
      orderBy: orderBy,
      orderDirection: orderDirection,
      liker: props.address ? props.address.toLowerCase() : '',
      filters: inkFilters
    }
  });

  const debouncedInks = useDebounce(
    Object.keys(inks).map(function (x) {
    return parseInt(x);
  }), 2000);

  const { loading: likesLoading, error: likesError, data: likesData} = useQuery(INK_LIKES_QUERY, {
    variables: {
      inks: debouncedInks,
      liker: props.address ? props.address.toLowerCase() : '',
    },
    pollInterval: 6000
  });

  useEffect(()=>{
    if(likesData && likesData.inks && likesData.inks.length > 0) {
      setLikes(likesData.inks)
    }
  }
  ,[likesData])

  const getMetadata = async (jsonURL) => {
    const response = await fetch("https://ipfs.io/ipfs/" + jsonURL);
    const data = await response.json();
    return data;
  };

  const getInks = async (data) => {
    setAllInks([...allInks, ...data])
    let blocklist
    if(props.supabase) {
    let { data: supabaseBlocklist } = await props.supabase
      .from('blocklist')
      .select('jsonUrl')
      blocklist = supabaseBlocklist
    }
    data.forEach(async (ink) => {
      if (isBlocklisted(ink.jsonUrl)) return;
      if (blocklist && blocklist.find(el => el.jsonUrl === ink.jsonUrl)) {
        return;
      }
      let _ink = ink;
      _ink.metadata = await getMetadata(ink.jsonUrl);
      let _newInk = {}
      _newInk[_ink.inkNumber] = _ink
      setInks((inks) => ({...inks, ..._newInk}));
      //setInks((inks) => [...inks, _ink]);
    });
  };

  const onLoadMore = useCallback(() => {
    if (
      Math.round(window.scrollY + window.innerHeight) >=
      Math.round(document.body.scrollHeight)
    ) {
      fetchMore({
        variables: {
          skip: allInks.length
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        }
      });
    }
  }, [fetchMore, allInks.length]);

  useEffect(() => {
    data ? getInks(data.inks) : console.log("loading");
  }, [data]);

  useEffect(() => {
  window.addEventListener("scroll", onLoadMore);
  return () => {
    window.removeEventListener("scroll", onLoadMore);
  };
}, [onLoadMore]);


  if (loading) return <Loader/>;
  if (error) return `Error! ${error.message}`;

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

    return (
    <div style={{ width: "90%", margin: "0 auto" }}>
    {<Row justify="center" style={{margin: 5}}>
    <Form
      layout={"inline"}
      initialValues={{ layout: layout, dateRange: [startDate, endDate], orderBy: orderBy, orderDirection: orderDirection, forSale: forSale }}
    >
    <Form.Item name="layout">
    <Radio.Group size="large" value={layout} onChange={(v)=>{setLayout(v.target.value)}}>
      <Radio.Button value={"cards"}>Cards</Radio.Button>
      <Radio.Button value={"tiles"}>Tiles</Radio.Button>
    </Radio.Group>
    </Form.Item>
    {layout=="cards"&&
    <>
    <Form.Item name="dateRange">
    <CustomTimeRangePicker size="large"
    value={[startDate, endDate]}
    onChange={(moments, dateStrings) => {
      searchParams.set("startDate", dateStrings[0])
      searchParams.set("endDate", dateStrings[1])
      history.push(`${location.pathname}?${searchParams.toString()}`);
      setStartDate(dayjs(dateStrings[0]))
      setEndDate(dayjs(dateStrings[1]))
      setInks({})
    }}/>
    </Form.Item>
    <Form.Item name="orderBy">
    <Select value={orderBy} style={{ width: 120 }} size="large"
      onChange={(val) => {
        searchParams.set("orderBy", val)
        history.push(`${location.pathname}?${searchParams.toString()}`);
        setInks({})
        setOrderBy(val)
      }
      }>
      <Option value="createdAt">Created At</Option>
      <Option value="bestPrice">Price</Option>
      <Option value="likeCount">Likes</Option>
      <Option value="count">Token Count</Option>
    </Select>
    </Form.Item>
    <Form.Item name="orderDirection">
    <Select value={orderDirection} style={{ width: 120 }} size="large"
      onChange={(val) => {
        searchParams.set("orderDirection", val)
        history.push(`${location.pathname}?${searchParams.toString()}`);
        setOrderDirection(val)
        setInks({})
      }}>
      <Option value="desc">Descending</Option>
      <Option value="asc">Ascending</Option>
    </Select>
    </Form.Item>
    <Form.Item name="forSale">
    <Select value={forSale} style={{ width: 120 }} size="large"
      onChange={(val) => {
        searchParams.set("forSale", val)
        history.push(`${location.pathname}?${searchParams.toString()}`);
        setForSale(val)
        setInks({})
      }}>
      <Option value={"for-sale"}>For sale</Option>
      <Option value={"all-inks"}>All inks</Option>
    </Select>
    </Form.Item>
    </>
    }
    </Form>
    </Row>}
      <div className="inks-grid">
        <ul style={{ padding: 0, textAlign: "center", listStyle: "none" }}>
        {inks
          ? Object.keys(inks)
              .sort((a, b) => inks[orderDirection=="desc"?b:a][orderBy] - inks[orderDirection=="desc"?a:b][orderBy])
              .map((ink) => {
                let likeInfo = likes.length>0&&likes.find(element => element.inkNumber === inks[ink].inkNumber)
                return (
              <li
                key={inks[ink].id}
                style={layout=="cards"?{
                  display: "inline-block",
                  verticalAlign: "top",
                  margin: 10,
                  padding: 10,
                  border: "1px solid #e5e5e6",
                  borderRadius: "10px",
                  fontWeight: "bold"
                }:{display: "inline-block", border: "1px solid #e5e5e6",
                borderRadius: "10px",}}
              >
              <Link
                to={{pathname: "/ink/"+inks[ink].id}}
                style={{ color: "black" }}
              >
                  <img
                    src={inks[ink].metadata.image}
                    alt={inks[ink].metadata.name}
                    width={layout=="cards"?"180":"150"}
                    style={layout=="cards"?{
                      border: "1px solid #e5e5e6",
                      borderRadius: "10px"
                    }:{}}
                  />
                  {layout=="cards"&&<>
                  <Row
                  align="middle"
                  style={{ textAlign: "center", justifyContent: "center", width:"180" }}
                  >
                  <h3
                    style={{ margin: "10px 0px 5px 0px", fontWeight: "700" }}
                  >
                    {inks[ink].metadata.name.length > 18
                      ? inks[ink].metadata.name.slice(0, 15).concat("...")
                      : inks[ink].metadata.name}
                  </h3>
                  </Row>

                  <Row
                    align="middle"
                    style={{ textAlign: "center", justifyContent: "center", width: "180" }}
                  >
                    {(inks[ink].bestPrice > 0)
                      ? (<><p
                      style={{
                        color: "#5e5e5e",
                        margin: "0"
                      }}
                    >
                      <b>{parseFloat(ethers.utils.formatEther(inks[ink].bestPrice))} </b>
                    </p>

                    <img
                      src="https://gateway.pinata.cloud/ipfs/QmQicgCRLfrrvdvioiPHL55mk5QFaQiX544b4tqBLzbfu6"
                      alt="xdai"
                      style={{ marginLeft: 5 }}
                    /></>)
                    : <>
                    <img
                      src="https://gateway.pinata.cloud/ipfs/QmQicgCRLfrrvdvioiPHL55mk5QFaQiX544b4tqBLzbfu6"
                      alt="xdai"
                      style={{ marginLeft: 5, visibility: "hidden" }}
                    />
                    </> }
                    <div style={{marginLeft: 10, marginRight: 10}}>
                    <LikeButton
                      metaProvider={props.metaProvider}
                      metaSigner={props.metaSigner}
                      injectedGsnSigner={props.injectedGsnSigner}
                      signingProvider={props.injectedProvider}
                      localProvider={props.kovanProvider}
                      contractAddress={props.contractAddress}
                      targetId={inks[ink].inkNumber}
                      likerAddress={props.address}
                      transactionConfig={props.transactionConfig}
                      likeCount={likeInfo&&likeInfo.likeCount || 0}
                      hasLiked={likeInfo&&likeInfo.likes.length > 0 || false}
                      marginBottom={"0px"}
                    />
                    </div>
                  </Row>
                  </>}
                </Link>
              </li>)
            })
          : null}
        </ul>
        <Row justify="center">
        </Row>
      </div>
    </div>
  );
}
