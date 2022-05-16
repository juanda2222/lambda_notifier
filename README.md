

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="">
    <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/message-icon-design-template-ff734aad72da096f0e49f3d693042135_screen.jpg?ts=1581057128" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Email Subscription Service</h3>

  <p align="center">
    Flexible notiifcation and alert system for ou AWS services
    <br />
    <a href="https://gitlab.com/instridehq/architect/email-subscriptions-service"><strong>Explore the project »</strong></a>
    <br />
    <br />
    <a href="https://gitlab.com/instridehq/architect/email-subscriptions-service/-/issues/new">Report Bug</a>
    ·
    <a href="https://gitlab.com/instridehq/architect/email-subscriptions-service/-/merge_requests/new">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project


The project is structured using Lambdas, Simple Notification service, S3, and a set of triggers and subscriptions explained in further sections.


### Built With AWS

The following is a diagram of the components used for the notification project.
<br />
<br />
![alt text](https://drive.google.com/uc?export=view&id=1lwyLeJY_dUlaYYdHgaps6lZSniIuxP9r)

The services used for the project are.

* [Lambda](https://aws.amazon.com/lambda/)
* [Simple Notification System](https://aws.amazon.com/sns/)
* [Storage 3](https://aws.amazon.com/s3/)
* [Cloud Watch](https://aws.amazon.com/cloudwatch/)

Here is how each component operates:
* A Config file upload trigger the update lambda function
* The update lambda reads the file and creates the necesary cloud watch log filters to trigger the notification lambda function. The update lambda, also sets up the necesary recipients and creates a backup config file.
* When a log matches a filter the notification lambda is triggered. The config file is read and the specified notification channel is used.
* A Config file delete will alse trigger the update lambda function, using the backup config file, the cloud watch log filters asociated with the file are deleted, as well as the recipients removed. Finally, the backup file is deleted


<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

The project is typescript based and the following packages are required beforehand; `Node, npm, aws`.

### Prerequisites
* AWS SDK
  ```sh
  curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
  
  sudo installer -pkg AWSCLIV2.pkg -target /
  ```
* Node and npm
  ```sh
  brew install node
  ```

### Installation

Only a simple npm installation is necesary

1. Set up your aws account just like it is described [here](https://docs.aws.amazon.com/rekognition/latest/dg/setup-awscli-sdk.html)

2. Install packages
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm i
   ```
4. Build and Deploy testing stack to aws
   ```sh
   npm run deploy
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

* To manually build and deploy to aws use:
   ```sh
   # build
   npm run build
   
   # deploy
   npm run publish
   ```
   
* To run tests use:
   ```sh
   npm run test
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Add SNS Topic notification support
- [x] Add Emails as default sns notification
- [x] Add Abstraction for different notification channels
- [x] Add Proper README.md
- [ ] Add Support for slack notifications
- [ ] Add suport for multiple recipients under the same rule
- [ ] Add local execution support
    - [ ] Use sam to locally launch lambdas
    - [ ] Use [serverless](https://www.serverless.com/console/docs) to improve the structure the project 

See the [open issues](https://gitlab.com/instridehq/architect/email-subscriptions-service/-/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://gitlab.com/instridehq/architect/email-subscriptions-service/-/merge_requests
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://gitlab.com/instridehq/architect/email-subscriptions-service
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://gitlab.com/instridehq/architect/email-subscriptions-service/-/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew

