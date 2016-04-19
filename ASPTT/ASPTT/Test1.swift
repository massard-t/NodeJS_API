//
//  Test1.swift
//  ASPTT
//
//  Created by Sullivan VITIELLO on 14/04/16.
//  Copyright © 2016 Sullivan VITIELLO. All rights reserved.
//

import Foundation

class Accueil : UIViewController {

    override func viewDidLoad() {
        self.view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())

    }

}