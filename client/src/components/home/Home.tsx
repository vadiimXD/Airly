import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
 

      <main className="home-root" role="main">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-left">
              <span className="material-symbols-outlined sized" aria-hidden="true">
                ☀️
              </span>
              <h1 className="hero-title">Airly</h1>
              <p className="hero-sub">Лесно наблюдение на времето и качеството на въздуха</p>

              <div className="hero-actions">
                <Link className="btn primary" to="/search">Търси локация</Link>
                <Link className="btn ghost" to="/forecast">Прогноза</Link>
              </div>
            </div>

            <div className="hero-right">
         

              <div className="weather-preview" aria-hidden="true">
                <div className="temp">9°C</div>
                <div className="cond">Ясно</div>
              </div>
            </div>
          </div>
        </section>

        <section className="cards" aria-label="Преглед">
          <div className="cards-inner">
            <article className="card">
              <div className="card-left">
                <h3 className="card-title">Текущо време</h3>
                <div className="card-sub">София</div>
              </div>
              <div className="card-right">
                <div className="card-value">9°C</div>
                <div className="card-info">Ясно</div>
              </div>
            </article>

            <article className="card">
              <div className="card-left">
                <h3 className="card-title">Вятър</h3>
                <div className="card-sub">Скорост</div>
              </div>
              <div className="card-right">
                <div className="card-value">12 km/h</div>
                <div className="card-info">Слаб</div>
              </div>
            </article>

            <article className="card">
              <div className="card-left">
                <h3 className="card-title">Влажност</h3>
                <div className="card-sub">Въздух</div>
              </div>
              <div className="card-right">
                <div className="card-value">72%</div>
                <div className="card-info">Умерено</div>
              </div>
            </article>

            <article className="card">
              <div className="card-left">
                <h3 className="card-title">Качество на въздуха</h3>
                <div className="card-sub">AQI</div>
              </div>
              <div className="card-right">
                <div className="card-value">35</div>
                <div className="card-info">Добро</div>
              </div>
            </article>
          </div>
        </section>

        <section className="about" id="about">
          <div className="about-inner">
            <h2>За нас</h2>
            <p>
              Airly ви дава бърз достъп до времето и качеството на въздуха.
            </p>
            <Link className="btn link" to="/about">Научи повече</Link>
          </div>
        </section>
      </main>


    </>
  );
}