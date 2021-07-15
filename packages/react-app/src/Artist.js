import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useParams, Link, useHistory } from "react-router-dom";
import { useQuery } from "react-apollo";
import { ARTISTS_QUERY, ARTIST_RECENT_ACTIVITY_QUERY } from "./apollo/queries"
import { isBlocklisted } from "./helpers";
import { Row, Col, Divider, Button, Form, notification, Tabs } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Blockies from "react-blockies";
import { AddressInput, Loader } from "./components"


const dayjs = require('dayjs');
const { TabPane } = Tabs;

export default function Artist(props) {
  const { address } = useParams();
  const [inks, setInks] = useState([]);
  const [searchArtist] = Form.useForm();
  const history = useHistory();

  const [ens, setEns] = useState()
  const [activity, setActivity] = useState([]);
  const [activityCreatedAt, setActivityCreatedAt] = useState(dayjs().unix());
  const [userFirstActivity, setUserFirstActivity] = useState();

  useEffect(()=> {
    const getEns = async () => {
    let _ens = await props.mainnetProvider.lookupAddress(address)
    setEns(_ens)
  }
    getEns()
  },[address])

  const { loading, error, data } = useQuery(ARTISTS_QUERY, {
    variables: { address: address }
  });

  const { data: dataActivity, fetchMore} = useQuery(ARTIST_RECENT_ACTIVITY_QUERY, {
    variables: { 
      address: address, 
      createdAt: activityCreatedAt - 2592000,
      skipLikes: activity.filter(e => e.type==="like").length,
      skipPurchases: activity.filter(e => e.type==="purchase").length,
      skipInks: activity.filter(e => e.type==="mint").length,
      skipTransfers: activity.filter(e => e.type==="send").length + activity.filter(e => e.type==="burn").length
    }
  });

  const search = async (values) => {
    try {
      const newAddress = ethers.utils.getAddress(values["address"]);
      setInks([]);
      history.push("/artist/"+newAddress);
    } catch (e) {
      console.log("not an address");
      notification.open({
        message: "📛 Not a valid address!",
        description: "Please try again"
      });
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  
  const SearchForm = () => {
    return (
    <Row style={{ justifyContent: "center" }}>
      <Form
        form={searchArtist}
        layout={"inline"}
        name="searchArtist"
        onFinish={search}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="address"
          rules={[{ required: true, message: "Search for an Address or ENS" }]}
        >
          <AddressInput
            ensProvider={props.mainnetProvider}
            placeholder={"Search artist"}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            <SearchOutlined />
          </Button>
        </Form.Item>
      </Form>
    </Row>
  )
  };

  const StatCard = (props) => {
    return (
      <li style={{display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid rgb(229, 229, 230)", padding: "10px 20px", minWidth:"160px", margin: "10px"}}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <p style={{fontSize: "14px", color: "rgba(0, 0, 0, 0.45)"}}>{props.name}</p>
          <span>{props.emoji}</span>
        </div>
        <div>
          <p style={{textAlign: "left", fontSize: "24px", color: "rgba(0, 0, 0, 0.85)", margin: 0}}>{props.value}</p>
        </div>
    </li>
      )
  };

  const createActivityArray = _data => {
    let activities = [];
    let burnAddress = [
      "0x0000000000000000000000000000000000000000", 
      "0x000000000000000000000000000000000000dead"
    ];

    let user = _data.users[0];

    user.likes.forEach(like => {
      activities.push(
      {
          type: "like",
          emoji: "👍",
          createdAt: like.createdAt,
          inkId: like.ink.id,
          jsonUrl: like.ink.jsonUrl,
      }
      )
    })
    

    user.purchases.forEach(purchase => {
      activities.push(
      {
          type: "purchase",
          emoji: "💲",
          createdAt: purchase.createdAt,
          inkId: purchase.ink.id,
          jsonUrl: purchase.ink.jsonUrl,
      }
      )
    })

    if (user.artist !== null){
      user.artist.inks.forEach(ink => {
        activities.push(
        {
            type: "mint",
            emoji: "🖌️",
            createdAt: ink.createdAt,
            inkId: ink.id,
            jsonUrl: ink.jsonUrl,
        }
        )
      })
    }

    user.transfersFrom.forEach(transfer  => {
      activities.push(
      {
          type: transfer.to.address === burnAddress[0] || transfer.to.address === burnAddress[1] ? "burn" : "send",
          emoji: transfer.to.address === burnAddress[0] || transfer.to.adress === burnAddress[1] ? "🔥" : "✉️",
          createdAt: transfer.createdAt,
          inkId: transfer.ink.id,
          jsonUrl: transfer.ink.jsonUrl,
          to: transfer.to.address
      }
      )
    })
    
    return activities;
  }

  useEffect(() => {
    const getMetadata = async (jsonURL) => {
      const response = await fetch("https://ipfs.io/ipfs/" + jsonURL);
      const data = await response.json();
      return data;
    };

    const getInks = async (data) => {
      setInks([]);
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
        setInks((inks) => [...inks, _ink]);
      });
    };

    data !== undefined && data.artists[0] ? getInks(data.artists[0].inks) : console.log("loading");

    if (data !== undefined && data.users[0]){
      let { createdAt, lastInkAt, lastLikeAt, lastPurchaseAt } = data.users[0];
      let lastTransferAt = data.users[0].transfersFrom.length ? data.users[0].transfersFrom[0].createdAt : 0;
      let lastActivity = Math.max(...[lastInkAt, lastLikeAt, lastPurchaseAt, lastTransferAt].map(e=>parseInt(e)));

      setActivityCreatedAt(lastActivity + 1);
      setUserFirstActivity(parseInt(createdAt));
    } else {
      console.log("loading")
    }
  }, [data]);

  useEffect(() => { 
    const getArtworkURL = async (jsonURL) => {
      const response = await fetch("https://ipfs.io/ipfs/" + jsonURL);
      const data = await response.json();
      return data.image;
    };

    const getActivity = (dataActivity) => {
      let activityArray = createActivityArray(dataActivity);

      activityArray.forEach(async (activity) => {
        let _activity = activity;
        if (_activity.type === "send" || _activity.type === "burn") {
          _activity.to = await props.mainnetProvider.lookupAddress(activity.to) ? await props.mainnetProvider.lookupAddress(activity.to) : activity.to.substr(0,6);
        }
        _activity.artwork = await getArtworkURL(activity.jsonUrl)
        setActivity(activity => [...activity, _activity])
      })
    }

    dataActivity !== undefined && dataActivity.users.length && dataActivity.users[0].createdAt !== "0" ? getActivity(dataActivity) : console.log("loading activity") 

  },[dataActivity, activityCreatedAt]);

  const onLoadMore = useCallback(() => {
      fetchMore({
        variables: {
          createdAt: activityCreatedAt, 
          skipLikes: activity.filter(e => e.type==="like").length,
          skipPurchases: activity.filter(e => e.type==="purchase").length,
          skipInks: activity.filter(e => e.type==="mint").length,
          skipTransfers: activity.filter(e => e.type==="send").length + activity.filter(e => e.type==="burn").length
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        }
      });
      setActivityCreatedAt(parseInt(activityCreatedAt - 2592000));
  }, [fetchMore, activityCreatedAt]);

  if (loading) return <Loader/>;
  if (error) return `Error! ${error.message}`;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{marginBottom: "15px"}}>
        <Row style={{ textAlign: "center" }}>
          <Col span={12} offset={6}>
            <Blockies
              seed={address.toLowerCase()}
              size={12} scale={6}
              className="artist_blockie"
            />
            <h2 style={{ margin: 10 }}>{ens ? ens : address.slice(0, 6)}</h2>
          </Col>
        </Row>
      </div>

      <Tabs defaultActiveKey="1" size="large" type="card" style={{textAlign:"center"}}>
        <TabPane tab="🖼️ Inks" key="1">
          <div className="inks-grid">
            <ul style={{ padding: 0, textAlign: "center", listStyle: "none"}}>
              {inks
                ? inks.map((ink) => (
                    <li
                      key={ink.id}
                      style={{
                        display: "inline-block",
                        verticalAlign: "top",
                        margin: 10,
                        padding: 10,
                        border: "1px solid #e5e5e6",
                        borderRadius: "10px",
                        fontWeight: "bold"
                      }}
                    >
                    <Link
                      to={{pathname: "/ink/"+ink.id}}
                      style={{ color: "black" }}
                    >
                        <img
                          src={ink.metadata.image}
                          alt={ink.metadata.name}
                          width="150"
                          style={{
                            border: "1px solid #e5e5e6",
                            borderRadius: "10px"
                          }}
                        />
                        <h3
                          style={{ margin: "10px 0px 5px 0px", fontWeight: "700" }}
                        >
                          {ink.metadata.name.length > 18
                            ? ink.metadata.name.slice(0, 15).concat("...")
                            : ink.metadata.name}
                        </h3>

                        <Row
                          align="middle"
                          style={{ textAlign: "center", justifyContent: "center" }}
                        >
                          {(ink.bestPrice > 0)
                            ? (<><p
                            style={{
                              color: "#5e5e5e",
                              margin: "0"
                            }}
                          >
                            <b>{ethers.utils.formatEther(ink.bestPrice)} </b>
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
                        </Row>
                        <Divider style={{ margin: "8px 0px" }} />
                        <p style={{ color: "#5e5e5e", margin: "0", zoom: 0.8 }}>
                          {'Edition: ' + ink.count + (ink.limit>0?'/' + ink.limit:'')}
                        </p>
                      </Link>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </TabPane>
        <TabPane tab="👛 Purchases" key="2">
          <Row>
            <Col span={24}>
            <div style={{width: "450px", margin: "0 auto"}}>
              <div style={{marginTop: "20px"}}>

              </div>
            </div>
              <p style={{ margin: 0 }}>
              Wow, such empty
              </p>
            </Col>

          </Row>
        </TabPane>
        <TabPane tab="📈 Statistics" key="3">
        <div style={{marginTop: "20px"}}>
          <Row gutter={16} wrap={true}>
            <ul style={{display: "flex", flexWrap: "wrap", justifyContent: "center", padding: "0", margin: "0 20px"}}>
              <StatCard 
              name={"Inks created"}
              value={data.artists.length ? data.artists[0].inkCount : 0}
              emoji={"🖼️"}
              />
              <StatCard 
              name={"Inks sold"}
              value={data.users.length ? data.users[0].saleCount : 0}
              emoji={"🖼️"}
              />
              <StatCard 
              name={"Inks purchased"}
              value={data.users.length ? data.users[0].purchaseCount : 0}
              emoji={"🖼️"}
              />
              <StatCard 
              name={"Likes"}
              value={data.users.length ? data.users[0].likeCount : 0}
              emoji={"👍"}
              />
              <StatCard 
              name={"Earnings"}
              value={`$${data.artists.length ? parseInt(ethers.utils.formatEther(data.artists[0].earnings)).toFixed(2) : 0}`}
              emoji={"💲"}
              />
            </ul>
          </Row>
          </div>
        </TabPane>
        <TabPane tab="🕗 Recent activity" key="4">
          {
          activity !== undefined && activity.length ? 
          <div style={{width: "450px", margin: "0 auto"}}>
            <ul style={{listStyle: "none", padding: 0, textAlign: "left", marginTop: "20px"}}>
              {activity.sort((a, b) => b.createdAt - a.createdAt).map((e,i) => 
              <li key={i} style={{borderBottom: "1px solid #f0f0f0", padding: "5px 0", display: "flex"}}>
              <Link to={{pathname: "/ink/"+e.inkId}}>
                <div style={{position: "relative", top: "0", left: "0"}}>
                    <img src={e.artwork} alt="ink" style={{width: "70px", border: "1px solid #f0f0f0", borderRadius: "5px", padding: "5px", position: "relative", top: "0", left: "0"}}></img>
                    <span style={{position: "absolute", top: "42px", left: "0", border: "2px solid #f0f0f0", background: "white", borderRadius: "5px", padding: "1px"}}>
                      {e.emoji}
                    </span>
                </div>
              </Link>
             
              <div style={{margin: "10px 12px", color: "#525252"}}>
                { e.type === "like" ? <Link to={{pathname: "/ink/"+e.inkId}}><h3 style={{margin: 0}}>Liked an ink</h3></Link>
                : e.type === "purchase" ? <Link to={{pathname: "/ink/"+e.inkId}}><h3 style={{margin: 0}}>Purchased an ink</h3></Link>
                : e.type === "send" ?  
                  <span style={{display: "flex"}}>
                    <Link to={{pathname: "/ink/"+e.inkId}}><h3 style={{margin: 0}}>Sent an ink to {e.to}</h3> </Link>
                  </span>
                : e.type === "burn" ? <Link to={{pathname: "/ink/"+e.inkId}}><h3 style={{margin: 0}}>Burned an ink</h3></Link>
                : <Link to={{pathname: "/ink/"+e.inkId}}><h3 style={{margin: 0}}>Minted a new ink</h3></Link> } 
                <p style={{margin: 0, color: "#8c8c8c", fontSize: "0.8rem", marginTop: "2px"}}>{dayjs.unix(e.createdAt).format('DD MMM YYYY, HH:mma')}</p>
              </div>
              </li>
              )}
              {activity[activity.length-1].createdAt <= userFirstActivity ?  null : <Button type="dashed" size="large" block onClick={() => onLoadMore()}>Load more</Button>}
            </ul> 
          </div>
          : null
          }

        </TabPane>
        <TabPane tab="🔍 Search artists" key="5">
          <Row style={{ margin: 20 }}>
            <Col span={24}><SearchForm/></Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
}
