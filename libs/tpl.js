 const esj = require("ejs")
 const heredoc = require("heredoc")
 let tpl = heredoc(function () {
     /*
          <xml>
             <ToUserName><![CDATA[<%=toUserName %>]]></ToUserName>
             <FromUserName><![CDATA[<%=fromUserName %>]]></FromUserName>  
             <CreateTime><%= createTime%></CreateTime>
             <MsgType><![CDATA[<%= msgType %>]]></MsgType>  
                 <% if (msgType === 'text') {%>
                     <Content><![CDATA[<%= content %>]]></Content>
                 <% }else if (msgType === 'image'){%>
                     <Image>
                        <MediaId><![CDATA[<%=media_id%>]]></MediaId> 
                     </Image>
                 <% }else if (msgType === 'voice'){%>
                     <Voice>
                        <MediaId>< ![CDATA[<%=media_id%>] ]></MediaId>
                     </Voice>
                 <% }else if (msgType === 'video'){%>
                     <Video>
                        <MediaId><![CDATA[<%=media_id%>]]></MediaId>
                        <Title><![CDATA[<%=content.title%>]]></Title>
                        <Description>< ![CDATA[<%=content.description%>]]></Description>
                    </Video>
                 <% }else if (msgType === 'news'){%>
                    <ArticleCount><%=content.length%></ArticleCount>
                     <Articles>
                       <% content.forEach(function(item){%>
                            <item>
                                <Title><![CDATA[<%=item.title%>]]></Title>
                                <Description><![CDATA[<%=item.description%>]]></Description>
                                <Url><![CDATA[<%=item.url%>]]></Url> 
                                <PicUrl><![CDATA[<%=item.picUrl%>]]></PicUrl> 
                            </item>   
                       <%})%>    
                     </Articles>   
                 <%} else if(msgType === 'music'){%>
                    <Music>
                        <Title><![CDATA[<%= content.title%>]]></Title>
                        <Description><![CDATA[<%= content.description%>]]></Description>
                        <MusicUrl><![CDATA[<%= content.url%>]]></MusicUrl>
                        <HQMusicUrl><![CDATA[<%= content.hqMusicUrl%>]]></HQMusicUrl>
                        <ThumbMediaId><![CDATA[<%=content.thumbMediaId%>]]></ThumbMediaId>
                    </Music>
                 <%}%>  
          </xml>
      */
 })
 let comliled = esj.compile(tpl)
 exports = module.exports = {
     comliled: comliled
 }