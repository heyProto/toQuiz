import React from 'react';
import ReactDOM from 'react-dom';

export default class ResultCard extends React.Component {

  componentDidMount() {
    if (this.props.cardConfigs.social_share) {
      setTimeout(function() {
        //twitter
        window.twttr = (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
          if (d.getElementById(id)) return t;
          js = d.createElement(s);
          js.id = id;
          js.src = "https://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js, fjs);

          t._e = [];
          t.ready = function(f) {
            t._e.push(f);
          };

          return t;
        }(document, "script", "twitter-wjs"));
        //fb
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
          fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
      }, 500);
    }
  }

  goBack(e) {
    const conclusionCard = document.querySelector('.protograph-toQuiz-conclusion-card'),
      conclusionFront = document.querySelector('.protograph-toQuiz-conclusion-front'),
      conclusionBack = document.querySelector('.protograph-toQuiz-conclusion-back');
    conclusionFront.style.display = 'block';
    setTimeout((e) => {
      conclusionBack.style.display = 'none';
    }, 100);
    conclusionCard.classList.remove('protograph-toQuiz-clicked');
  }

  renderReadingLinks() {
    const resultCardConfigs = this.props.resultCardConfigs,
      isScoreSpecific = false,
      config = this.props.cardConfigs;

    const relatedLinks = resultCardConfigs.length > 2 ? resultCardConfigs.slice(0, 2) : resultCardConfigs;

    let links = relatedLinks.map((d, i) => {
      return (
        <div key={i} className='protograph-toQuiz-single-link-container' >
          <a className='protograph-toQuiz-single-link' href={`${d.related_article_links}`} target='blank'>
            {
              d.related_article_links ?
                <img src={`${d.link_image.image}`} className='protograph-toQuiz-link-img' />
              :
                undefined
            }
            <div className={`protograph-toQuiz-link-info ${!d.related_article_links ? 'protograph-toQuiz-link-info-full-width' : ''}`} >
              <div className="protograph-toQuiz-link-title">{d.link_description}</div>
            </div>
          </a>
          <div className='protograph-toQuiz-clearfix'></div>
        </div>
      )
    });

    return links;
  }

  render() {
    const conclusionCardStyle = {};
    let replayStyleCss = '',
      revisitStyleCss = '',
      shareStyleCss = '',
      links,
      languageTexts = this.props.languageTexts,
      message = languageTexts.message,
      readingLinks;

    if (this.props.resultCardConfigs && this.props.resultCardConfigs.length) {
      links = this.renderReadingLinks();
    }

    conclusionCardStyle.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0.0005, 0, ${ 160 - ((+this.props.totalQuestions + 1) * 13) }, ${((+this.props.totalQuestions + 1) * 320 * -1)}, ${(1 + 0.08 * (+this.props.totalQuestions + 1))})`;
    if(+this.props.totalQuestions > 1) {
      conclusionCardStyle.opacity = 0;
    }

    if(!this.props.cardConfigs.social_share) {
      revisitStyleCss = 'protograph-toQuiz-half-size';
    }

    if(this.props.cardConfigs.revisit_answers === false && this.props.cardConfigs.social_share === false) {
      replayStyleCss = 'protograph-toQuiz-full-size';
    } else if(this.props.cardConfigs.revisit_answers === false || this.props.cardConfigs.social_share === false) {
      replayStyleCss = 'protograph-toQuiz-half-size';
    }

    if(!this.props.cardConfigs.revisit_answers) {
      shareStyleCss = 'protograph-toQuiz-half-size';
    }

    return (
      <div className={`protograph-toQuiz-conclusion-card ${this.props.isMobile ? 'protograph-toQuiz-mobile-conclusion-card' : ''}`} style={conclusionCardStyle}>
        <div className='protograph-toQuiz-content'>
          <div className='protograph-toQuiz-conclusion-front'>
            <div id="result_container" className="protograph-toQuiz-result-container">
              <img className="protograph-toQuiz-result-img" src={`${this.props.baseURL}/images/cup.png`} />
              <div className="protograph-toQuiz-result-text">{message}</div>
              {
                this.props.cardConfigs.quiz_type === 'scoring' &&
                <div className="protograph-toQuiz-result-score">
                  {
                    this.props.cardConfigs.timer ?
                      `${this.props.score} / ${this.props.totalQuestions * this.props.cardConfigs.time_per_question}` :
                      `${this.props.score} / ${+this.props.totalQuestions}`
                  }
                </div>
              }
            </div>
            <div id="buttons_container" className="protograph-toQuiz-buttons-container">
              {
                this.props.cardConfigs.revisit_answers ?
                  <div id="revisit" className={`protograph-toQuiz-revisit protograph-toQuiz-card-button ${revisitStyleCss}`} onClick={this.props.cardEvents.revisitAnswers} >
                    <img className="protograph-toQuiz-card-button-img" src={`${this.props.baseURL}/images/revisit-icon.png`} />
                    <div className="protograph-toQuiz-card-button-text">{languageTexts.revisit_answers}</div>
                  </div>
                :
                  undefined
              }

              <div id="replay" className={`protograph-toQuiz-replay protograph-toQuiz-card-button ${replayStyleCss}`}  onClick={this.props.cardEvents.resetQuiz} >
                <img className="protograph-toQuiz-card-button-img" src={`${this.props.baseURL}/images/replay.png`} />
                <div className="protograph-toQuiz-card-button-text">{languageTexts.play_again}</div>
              </div>

              {
                this.props.cardConfigs.social_share ?
                  <div id="share" className={`protograph-toQuiz-share protograph-toQuiz-card-button ${shareStyleCss}`} onClick={this.props.cardEvents.socialShare}>
                    <img className="protograph-toQuiz-card-button-img" src={`${this.props.baseURL}/images/share.png`} />
                    <div className="protograph-toQuiz-card-button-text">{languageTexts.social_share}</div>
                  </div>
                :
                  undefined
              }
              <div className="protograph-toQuiz-clearfix"></div>
            </div>
            {
              links && links.length > 0 &&
                <div className="protograph-toQuiz-links-container">
                  <div className="protograph-toQuiz-related-links-title">{languageTexts.related_articles}</div>
                  <div className="protograph-toQuiz-related-links-content">
                    { links }
                  </div>
                </div>
            }
            <div id="credits" className="protograph-toQuiz-credits" >
              <a href={this.props.creditLink} target="blank">{this.props.creditMessage}</a>
            </div>
          </div>
          {
            this.props.cardConfigs.social_share &&
              <div className='protograph-toQuiz-conclusion-back'>
                <div className="protograph-toQuiz-share-card">
                  <div className="protograph-toQuiz-share-image-div" style={{backgroundImage: `url('${this.props.introCardConfigs.background_image}')`}}>
                    <div className="protograph-toQuiz-share-title" style={{color: 'white'}}>
                      {
                        this.props.introCardConfigs.quiz_title
                      }
                    </div>
                  </div>
                  <div className="protograph-toQuiz-share-msg">
                    {
                      this.props.cardConfigs.share_msg.replace(/{score}/g, this.props.score)
                    }
                  </div>
                </div>
                <div className="protograph-toQuiz-share-buttons-div">
                  <div className='protograph-toQuiz-fb-div'>
                    <div
                      className="fb-share-button"
                      data-href={`${this.props.cardConfigs.share_link}`}
                      data-layout="button"
                      data-size="large"
                      data-mobile-iframe="true">
                      <a
                        className="fb-xfbml-parse-ignore"
                        target="_blank"
                        href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse">
                        Share
                      </a>
                    </div>
                  </div>
                  <div className='protograph-toQuiz-twitter-div'>
                    <a
                      className="twitter-share-button"
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.props.cardConfigs.share_msg)}&url=${encodeURIComponent(this.props.cardConfigs.share_link)}`}
                      data-size="large">Tweet
                    </a>
                  </div>
                  <div className="protograph-toQuiz-clearfix"></div>
                </div>
                <div className="protograph-toQuiz-back-link" onClick={(e) => this.goBack(e)}>{languageTexts.go_back}</div>
                <div id="credits" className="protograph-toQuiz-credits" >
                  <a href={this.props.creditLink} target="blank">{this.props.creditMessage}</a>
                </div>
              </div>
          }
        </div>
      </div>
    )
  }
}