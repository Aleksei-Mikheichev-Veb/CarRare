<?php
	 ini_set('display_errors', 1);
	 ini_set('display_startup_errors', 1);
	 error_reporting(E_ALL);

	 use PHPMailer\PHPMailer\PHPMailer;
	 use PHPMailer\PHPMailer\Exception;

	 require 'phpmailer/src/Exception.php';
	 require 'phpmailer/src/PHPMailer.php';
	 require 'phpmailer/src/SMTP.php';

	 $mail = new PHPMailer(true);
	 $mail->CharSet = 'UTF-8';
	 $mail->setLanguage('ru', 'phpmailer/language/');
	 $mail->IsHTML(true);

     $mail->Host = 'smtp.beget.com';
	 $mail->Port = 465;
	 $mail->Username = 'yourMail.ru';
	 $mail->Password = 'password';
	
	//От кого письмо
	$mail->setFrom('exampleMail.ru');
	//Кому отправить
	$mail->addAddress('yourMail');
	 //Тема письма
	 $mail->Subject = 'Здравствуйте, нужна машина"';


	 //Тело письма
	 $body = '<h1>Здравствуйте, нужна машина</h1>';
	
	 if(trim(!empty($_POST['name']))){
	 	$body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
	 }
	 if(trim(!empty($_POST['phone']))){
	 	$body.='<p><strong>Телефон:</strong> '.$_POST['phone'].'</p>';
	 }
	 if(trim(!empty($_POST['email']))){
	 	$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	 }
	
	 if(trim(!empty($_POST['message']))){
	 	$body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
	 }
	
	 $mail->msgHTML($body);

	// //Отправляем
	 try {
	 	if (!$mail->send()) {
	 		$message = 'Ошибка';
	 	} else {
	 		$message = 'Данные отправлены!';
	 	}
	 } catch (\Exception $e) {
	 	$message = $e->getMessage();
	 }

	 $response = ['message' => $message];

	 header('Content-type: application/json');
	 echo json_encode($response);
?>
